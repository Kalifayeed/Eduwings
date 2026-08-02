/**
 * Search result shapes.
 *
 * Kept apart from `@/lib/search`, which is `server-only`: the search dialog is a
 * Client Component and must be able to import these types without pulling the
 * server module into its graph.
 */

export type SearchGroup =
  "Career" | "Article" | "Event" | "Activity" | "Programme" | "Question" | "Page";

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  group: SearchGroup;
  score: number;
}
