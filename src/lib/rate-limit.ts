import "server-only";

/**
 * Fixed-window rate limiter.
 *
 * Deliberately dependency-free and in-memory. A Redis-backed limiter would be
 * strictly better on a horizontally scaled deployment, but it introduces an
 * external service, credentials and a failure mode for a site whose write
 * endpoints are a handful of low-volume forms. In-memory limiting on each
 * instance raises the effective ceiling proportionally to instance count while
 * still stopping the realistic threat here: a single client hammering a form.
 *
 * The `RateLimitStore` seam below is what makes swapping in Redis a
 * self-contained change when traffic justifies it.
 *
 * Note for serverless: state lives for the lifetime of the execution
 * environment. Cold starts reset counters, which is acceptable for abuse
 * mitigation and is not relied upon for correctness anywhere.
 */

interface Bucket {
  count: number;
  /** Epoch milliseconds at which the current window ends. */
  resetAt: number;
}

interface RateLimitStore {
  get(key: string): Bucket | undefined;
  set(key: string, bucket: Bucket): void;
  prune(now: number): void;
}

const memoryStore: RateLimitStore = (() => {
  const buckets = new Map<string, Bucket>();
  return {
    get: (key) => buckets.get(key),
    set: (key, bucket) => {
      buckets.set(key, bucket);
    },
    prune: (now) => {
      for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
      }
    },
  };
})();

export interface RateLimitConfig {
  /** Requests permitted per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Epoch seconds — the value for the `X-RateLimit-Reset` header. */
  reset: number;
  /** Seconds until the window resets. Sent as `Retry-After` on a 429. */
  retryAfter: number;
}

/** Tuned per endpoint class; write endpoints are far tighter than reads. */
export const RATE_LIMITS = {
  /** Form submissions — contact, volunteer, school requests, registrations. */
  form: { limit: 5, windowMs: 10 * 60 * 1000 },
  /** Newsletter sign-up. Slightly looser: a genuine retry is common. */
  newsletter: { limit: 8, windowMs: 10 * 60 * 1000 },
  /** Search — interactive, so generous, but not unbounded. */
  search: { limit: 60, windowMs: 60 * 1000 },
  /** Authentication attempts. */
  auth: { limit: 10, windowMs: 15 * 60 * 1000 },
} as const satisfies Record<string, RateLimitConfig>;

let lastPrune = 0;
const PRUNE_INTERVAL_MS = 60_000;

export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();

  // Amortised cleanup: expired buckets would otherwise grow without bound on a
  // long-lived instance.
  if (now - lastPrune > PRUNE_INTERVAL_MS) {
    memoryStore.prune(now);
    lastPrune = now;
  }

  const existing = memoryStore.get(key);
  const bucket =
    existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + config.windowMs };

  bucket.count += 1;
  memoryStore.set(key, bucket);

  const remaining = Math.max(0, config.limit - bucket.count);
  const retryAfter = Math.max(0, Math.ceil((bucket.resetAt - now) / 1000));

  return {
    success: bucket.count <= config.limit,
    limit: config.limit,
    remaining,
    reset: Math.ceil(bucket.resetAt / 1000),
    retryAfter,
  };
}

/** Headers describing the caller's current quota. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
  };
  if (!result.success) headers["Retry-After"] = String(result.retryAfter);
  return headers;
}
