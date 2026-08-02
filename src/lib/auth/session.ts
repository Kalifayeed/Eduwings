import "server-only";

import { cache } from "react";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/supabase/database.types";

/**
 * Authenticated user resolution for Server Components.
 *
 * `cache()` deduplicates the lookup across a single render pass: the admin
 * layout, the sidebar and a page can each ask "who is this?" without three
 * round-trips to Supabase.
 */

export interface SessionUser {
  id: string;
  email: string;
  fullName: string | null;
  role: AppRole;
  avatarUrl: string | null;
}

/**
 * Returns the signed-in user with their profile, or `null`.
 *
 * `getUser()` is used rather than `getSession()` because it validates the token
 * with Supabase's auth server. `getSession()` reads a cookie and trusts it,
 * which is fine for optimistic UI and unacceptable for an authorisation check.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  // A user can exist in `auth.users` momentarily before the profile trigger has
  // run. Treating them as the lowest privilege level is the safe default.
  return {
    id: user.id,
    email: profile?.email ?? user.email ?? "",
    fullName: profile?.full_name ?? null,
    role: profile?.role ?? "viewer",
    avatarUrl: profile?.avatar_url ?? null,
  };
});

export function isStaff(user: SessionUser | null): boolean {
  return user?.role === "admin" || user?.role === "editor";
}

export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === "admin";
}
