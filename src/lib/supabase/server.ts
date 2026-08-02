import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { capabilities, env } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Request-scoped Supabase client that reads and refreshes the auth session from
 * cookies. Use this for anything that must respect Row Level Security — which is
 * everything except the narrow admin paths below.
 */
export async function createServerSupabaseClient() {
  if (!capabilities.supabase) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components cannot mutate cookies. The middleware refreshes
            // the session on every request, so this is safe to ignore here.
          }
        },
      },
    },
  );
}

/**
 * Service-role client. Bypasses Row Level Security entirely.
 *
 * Restricted to two situations: writes from validated API routes on behalf of
 * anonymous visitors (newsletter sign-up, form submissions), and administrative
 * operations after the caller's admin role has already been verified. It must
 * never be constructed in a Client Component — `server-only` makes that a build
 * error rather than a security incident.
 */
export function createAdminSupabaseClient() {
  if (!capabilities.supabaseAdmin) return null;

  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
