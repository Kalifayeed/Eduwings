"use client";

import { createBrowserClient } from "@supabase/ssr";

import { capabilities, env } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Browser Supabase client.
 *
 * Returns `null` when Supabase is not configured so that client components can
 * degrade gracefully rather than throwing during render. Callers must handle the
 * null case — the type system enforces it.
 */
export function createClient() {
  if (!capabilities.supabase) return null;

  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
