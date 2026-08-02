"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import { logger } from "@/lib/logger";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signInSchema } from "@/lib/validation/auth";

/**
 * Authentication Server Actions.
 *
 * Server Actions rather than API routes: they can set the auth cookie during a
 * POST and redirect in the same round-trip, and Next.js protects them against
 * cross-origin invocation automatically.
 */

export interface AuthActionState {
  error: string | null;
}

export async function signIn(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Authentication is not configured on this deployment." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    logger.warn("auth.signin.failed", error.message);
    // Deliberately generic: distinguishing "no such user" from "wrong password"
    // tells an attacker which addresses are registered.
    return { error: "Those details did not match an account." };
  }

  const next = formData.get("next");
  const target = typeof next === "string" && next.startsWith("/admin") ? next : routes.admin.root;

  revalidatePath("/", "layout");
  redirect(target);
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();

  revalidatePath("/", "layout");
  redirect(routes.login);
}
