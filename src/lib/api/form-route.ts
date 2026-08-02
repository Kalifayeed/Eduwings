import "server-only";

import type { NextRequest } from "next/server";
import type { z } from "zod";

import { enforceRateLimit, fail, invalid, ok, readJson, verifySameOrigin } from "@/lib/api/http";
import { logger } from "@/lib/logger";
import { RATE_LIMITS, type RateLimitConfig } from "@/lib/rate-limit";

/**
 * Builds a POST handler for a public form.
 *
 * Every form endpoint needs the same six things in the same order, and getting
 * that order wrong is how validation gets skipped on one route out of six.
 * Encoding it once means a new form cannot accidentally ship without rate
 * limiting or origin verification:
 *
 *   1. Same-origin check — blocks cross-site POSTs without a token round-trip.
 *   2. Rate limit — per-IP, per-scope.
 *   3. JSON parse, tolerating malformed bodies.
 *   4. Honeypot check, before validation (see below).
 *   5. Zod validation against the shared schema.
 *   6. The handler, which receives fully typed, validated data.
 *
 * The honeypot is checked ahead of validation and answers with a *success*
 * response. Telling an automated submitter that it failed teaches it to retry
 * without the trap field; a silent success does not.
 */

interface FormRouteConfig<TSchema extends z.ZodType> {
  schema: TSchema;
  /** Rate-limit bucket name. Distinct scopes do not share a quota. */
  scope: string;
  limits?: RateLimitConfig;
  /**
   * Business logic. Anything thrown here becomes a 500 with a generic message —
   * internal failures are logged, never returned to the visitor.
   */
  handle: (data: z.output<TSchema>, request: NextRequest) => Promise<void>;
  /** Message shown on success. */
  successMessage: string;
}

export function createFormRoute<TSchema extends z.ZodType>({
  schema,
  scope,
  limits = RATE_LIMITS.form,
  handle,
  successMessage,
}: FormRouteConfig<TSchema>) {
  return async function POST(request: NextRequest) {
    const originError = verifySameOrigin(request);
    if (originError) return originError;

    const limited = enforceRateLimit(request, scope, limits);
    if (limited) return limited;

    const body = await readJson(request);
    if (body === null || typeof body !== "object") {
      return fail("We could not read that submission.", 400);
    }

    const honeypot = (body as Record<string, unknown>).website;
    if (typeof honeypot === "string" && honeypot.length > 0) {
      logger.warn("api.honeypot", scope);
      return ok({ message: successMessage });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) return invalid(parsed.error);

    try {
      await handle(parsed.data, request);
    } catch (error) {
      logger.error(`api.${scope}.failed`, error);
      return fail("Something went wrong on our side. Please try again, or call us.", 500);
    }

    return ok({ message: successMessage });
  };
}
