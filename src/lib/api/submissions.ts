import "server-only";

import type { SubmissionKind } from "@/lib/content/types";
import { logger } from "@/lib/logger";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

/**
 * Persistence for public form submissions.
 *
 * Uses the service-role client because the submitter is anonymous and the
 * `submissions` table denies all access to the anon role — nobody should be able
 * to read other people's enquiries by pointing a client at the API. The payload
 * reaching this function has already passed its Zod schema, so the only thing
 * crossing the trust boundary is validated data.
 *
 * When Supabase is not configured the submission is logged and reported as
 * stored. That is a deliberate choice for a site that must run without a
 * database: the visitor still gets their confirmation and the email notification
 * still goes out. The operational requirement — configure Supabase before going
 * live — is stated in the README and surfaced in the admin console.
 */

export interface SubmissionRecord {
  kind: SubmissionKind;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  payload: Record<string, unknown>;
}

export async function storeSubmission(record: SubmissionRecord): Promise<boolean> {
  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    logger.warn("submissions.store.skipped", "Supabase is not configured", {
      kind: record.kind,
      email: record.email,
    });
    return false;
  }

  const { error } = await supabase.from("submissions").insert({
    kind: record.kind,
    name: record.name,
    email: record.email,
    phone: record.phone ?? null,
    subject: record.subject ?? null,
    message: record.message ?? null,
    payload: record.payload as never,
  });

  if (error) {
    logger.error("submissions.store.failed", error, { kind: record.kind });
    return false;
  }

  return true;
}

/**
 * Records a newsletter subscriber.
 *
 * Re-subscribing is not an error: the unique index on `email` lets us upsert, so
 * someone who previously unsubscribed is quietly reactivated rather than shown a
 * failure they cannot act on.
 */
export async function storeSubscriber(
  email: string,
  name: string | null,
  source: string,
): Promise<boolean> {
  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    logger.warn("subscribers.store.skipped", "Supabase is not configured", { email });
    return false;
  }

  const { error } = await supabase
    .from("subscribers")
    .upsert(
      { email, name, source, status: "subscribed" },
      { onConflict: "email", ignoreDuplicates: false },
    );

  if (error) {
    logger.error("subscribers.store.failed", error);
    return false;
  }

  return true;
}
