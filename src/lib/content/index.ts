import type { ContentSource } from "@/lib/content/source";
import { capabilities } from "@/lib/env";
import { staticContentSource } from "@/lib/content/static";
import { supabaseContentSource } from "@/lib/content/supabase";

/**
 * Resolves the active content backend.
 *
 * Supabase wins when credentials are present; otherwise the bundled seed content
 * serves the site. This single decision point is what allows the application to
 * be cloned, installed and run to a complete, populated website with an empty
 * `.env` — and to become a live CMS-driven site the moment three environment
 * variables are added, with no code change.
 */
export function getContentSource(): ContentSource {
  return capabilities.supabase ? supabaseContentSource : staticContentSource;
}

export type { ContentSource } from "@/lib/content/source";
export * from "@/lib/content/types";
