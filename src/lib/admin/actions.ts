"use server";

import { revalidatePath } from "next/cache";

import { logger } from "@/lib/logger";
import { getSessionUser, isAdmin, isStaff } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dynamicTable, type TableName } from "@/lib/supabase/dynamic";

/**
 * Generic CRUD Server Actions for CMS resources.
 *
 * Writing these once rather than per resource means every table gets identical
 * authorisation, revalidation and error handling, and a new resource cannot ship
 * with a missing permission check.
 *
 * Two layers of authorisation apply, deliberately:
 *
 *  1. The role check here, which produces a readable error and stops the request
 *     before it reaches the database.
 *  2. Row Level Security, which is the actual boundary. These actions use the
 *     *session-scoped* client, not the service role, so a bug in the check below
 *     still cannot write data the signed-in user is not entitled to write.
 */

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

const FORBIDDEN: ActionResult = {
  ok: false,
  error: "You do not have permission to do that.",
};

/** Public routes that must be re-rendered when a given table changes. */
const REVALIDATION_PATHS: Partial<Record<TableName, string[]>> = {
  articles: ["/news", "/"],
  events: ["/events", "/"],
  gallery_items: ["/gallery"],
  partners: ["/partners", "/sponsors", "/"],
  testimonials: ["/", "/volunteer"],
  schools: ["/schools"],
  program_modules: ["/program", "/"],
  site_settings: ["/"],
};

function revalidateFor(table: TableName, adminPath: string) {
  revalidatePath(adminPath);
  for (const path of REVALIDATION_PATHS[table] ?? []) {
    revalidatePath(path);
  }
}

/** Turns Postgres constraint violations into something an editor can act on. */
function friendlyError(message: string): string {
  if (message.includes("duplicate key") && message.includes("slug")) {
    return "That URL slug is already in use. Choose a different one.";
  }
  if (message.includes("duplicate key")) {
    return "A record with those details already exists.";
  }
  if (message.includes("violates row-level security")) {
    return "You do not have permission to change this record.";
  }
  if (message.includes("violates check constraint")) {
    return "One of those values is outside the range we allow.";
  }
  return "The change could not be saved. Please try again.";
}

export async function createRecord(
  table: TableName,
  values: Record<string, unknown>,
  adminPath: string,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!isStaff(user)) return FORBIDDEN;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { ok: false, error: "The database is not configured." };

  const { data, error } = await dynamicTable(supabase, table).insert(values).select("id").single();

  if (error) {
    logger.error("admin.create.failed", error, { table });
    return { ok: false, error: friendlyError(error.message) };
  }

  revalidateFor(table, adminPath);
  return { ok: true, id: (data as { id?: string }).id };
}

export async function updateRecord(
  table: TableName,
  id: string,
  values: Record<string, unknown>,
  adminPath: string,
  /** Primary key column. `site_settings` is keyed on `key` rather than `id`. */
  idColumn: string = "id",
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!isStaff(user)) return FORBIDDEN;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { ok: false, error: "The database is not configured." };

  const { error } = await dynamicTable(supabase, table).update(values).eq(idColumn, id);

  if (error) {
    logger.error("admin.update.failed", error, { table, id });
    return { ok: false, error: friendlyError(error.message) };
  }

  revalidateFor(table, adminPath);
  return { ok: true, id };
}

/**
 * Permanent deletion, restricted to administrators.
 *
 * Editors archive instead — `setStatus(…, "archived")` — which is reversible.
 * Making destruction the harder path is deliberate.
 */
export async function deleteRecord(
  table: TableName,
  id: string,
  adminPath: string,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!isAdmin(user)) {
    return { ok: false, error: "Only administrators can delete records. Archive it instead." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { ok: false, error: "The database is not configured." };

  const { error } = await dynamicTable(supabase, table).delete().eq("id", id);

  if (error) {
    logger.error("admin.delete.failed", error, { table, id });
    return { ok: false, error: friendlyError(error.message) };
  }

  revalidateFor(table, adminPath);
  return { ok: true, id };
}

/**
 * Moves a record through the publish lifecycle.
 *
 * `published_at` is stamped on first publish and preserved thereafter, so that
 * unpublishing and republishing does not silently reorder a chronological feed.
 */
export async function setStatus(
  table: TableName,
  id: string,
  status: "draft" | "published" | "archived",
  adminPath: string,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!isStaff(user)) return FORBIDDEN;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { ok: false, error: "The database is not configured." };

  const patch: Record<string, unknown> = { status };

  if (status === "published") {
    const { data } = await dynamicTable(supabase, table)
      .select("published_at")
      .eq("id", id)
      .maybeSingle<{ published_at: string | null }>();

    if (!data?.published_at) patch.published_at = new Date().toISOString();
  }

  const { error } = await dynamicTable(supabase, table).update(patch).eq("id", id);

  if (error) {
    logger.error("admin.status.failed", error, { table, id, status });
    return { ok: false, error: friendlyError(error.message) };
  }

  revalidateFor(table, adminPath);
  return { ok: true, id };
}
