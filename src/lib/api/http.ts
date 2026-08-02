import "server-only";

import { NextResponse } from "next/server";
import type { ZodError } from "zod";

import type { ApiFailure, ApiSuccess } from "@/lib/api/types";
import { logger } from "@/lib/logger";
import { rateLimit, rateLimitHeaders, type RateLimitConfig } from "@/lib/rate-limit";

/**
 * Shared HTTP conventions for API routes.
 *
 * Every endpoint returns the same envelope — `{ ok, data }` or
 * `{ ok, error, fieldErrors? }` — so the client-side form helper can handle any
 * of them without endpoint-specific branching.
 */

export type { ApiFailure, ApiResponse, ApiSuccess } from "@/lib/api/types";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, { status: 200, ...init });
}

export function fail(error: string, status = 400, fieldErrors?: Record<string, string[]>) {
  return NextResponse.json<ApiFailure>({ ok: false, error, fieldErrors }, { status });
}

/** 422 with Zod's per-field messages flattened for the form layer. */
export function invalid(error: ZodError) {
  return fail(
    "Some details need attention before we can continue.",
    422,
    error.flatten().fieldErrors as Record<string, string[]>,
  );
}

/**
 * Best-effort client identity for rate limiting.
 *
 * Behind Vercel or any standard proxy, `x-forwarded-for` is set and its first
 * entry is the client. The header is spoofable in principle, which is why it is
 * used only for abuse mitigation and never for authorisation.
 */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";
  return `${scope}:${ip}`;
}

/**
 * Applies a rate limit and returns a ready-made 429 when exceeded.
 * Returns `null` when the request may proceed.
 */
export function enforceRateLimit(
  request: Request,
  scope: string,
  config: RateLimitConfig,
): NextResponse | null {
  const result = rateLimit(clientKey(request, scope), config);
  if (result.success) return null;

  logger.warn("api.rate-limited", scope, { retryAfter: result.retryAfter });

  return NextResponse.json<ApiFailure>(
    {
      ok: false,
      error: `Too many requests. Please try again in ${Math.ceil(result.retryAfter / 60)} minute(s).`,
    },
    { status: 429, headers: rateLimitHeaders(result) },
  );
}

/**
 * Rejects requests that did not originate from this site.
 *
 * Next.js Route Handlers are not protected by SameSite cookies alone, so we
 * verify that `origin` matches `host`. Combined with the CSP's `form-action
 * 'self'`, this closes off cross-site POSTs without needing a token round-trip.
 * Requests with no `origin` header (server-to-server, curl) are rejected on
 * mutating verbs.
 */
export function verifySameOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    return fail("Request origin could not be verified.", 403);
  }

  try {
    if (new URL(origin).host !== host) {
      return fail("Request origin could not be verified.", 403);
    }
  } catch {
    return fail("Request origin could not be verified.", 403);
  }

  return null;
}

/** Parses a JSON body, returning `null` when the payload is not valid JSON. */
export async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
