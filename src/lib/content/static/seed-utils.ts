import type { Publishable, Timestamped } from "@/lib/content/types";

/**
 * Seed records need `createdAt`/`updatedAt`/`publishedAt` to satisfy the same
 * domain types the database produces. Using a fixed reference date rather than
 * `new Date()` keeps static generation deterministic: the same commit always
 * builds byte-identical pages, which matters for caching and for diffing output.
 */
export const SEED_EPOCH = "2026-01-12T08:00:00.000Z";

export function published(publishedAt: string = SEED_EPOCH): Timestamped & Publishable {
  return {
    status: "published",
    publishedAt,
    createdAt: publishedAt,
    updatedAt: publishedAt,
  };
}
