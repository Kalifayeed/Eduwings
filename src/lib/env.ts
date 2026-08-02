import { z } from "zod";

/**
 * Environment access, validated once at module load.
 *
 * Design rule: **every** variable is optional. EduWings must build, boot and
 * render its entire public surface with an empty environment, so that a fresh
 * clone or a CI job never needs secrets. Each optional block instead exposes a
 * boolean capability flag (`hasSupabase`, `hasEmail`, …) that callers branch on.
 * A malformed value is a hard error; an absent one simply disables a feature.
 */

const optionalUrl = z
  .string()
  .trim()
  .url()
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalString = z
  .string()
  .trim()
  .min(1)
  .optional()
  .or(z.literal("").transform(() => undefined));

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: optionalUrl,

  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,

  RESEND_API_KEY: optionalString,
  EMAIL_FROM: optionalString,
  EMAIL_TO_ADMIN: optionalString,

  NEXT_PUBLIC_ANALYTICS_DOMAIN: optionalString,
  NEXT_PUBLIC_ANALYTICS_SRC: optionalUrl,
});

/**
 * Next.js inlines `process.env.NEXT_PUBLIC_*` only for statically analysable
 * member expressions, so each one must be referenced literally here.
 */
const parsed = schema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_TO_ADMIN: process.env.EMAIL_TO_ADMIN,
  NEXT_PUBLIC_ANALYTICS_DOMAIN: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN,
  NEXT_PUBLIC_ANALYTICS_SRC: process.env.NEXT_PUBLIC_ANALYTICS_SRC,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsed.data;

/** Vercel exposes the deployment host but not a full origin. */
function inferVercelUrl(): string | undefined {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return host ? `https://${host}` : undefined;
}

/** Canonical origin, without a trailing slash. Never returns an empty string. */
export const siteUrl: string = (
  env.NEXT_PUBLIC_SITE_URL ??
  inferVercelUrl() ??
  "http://localhost:3000"
).replace(/\/+$/, "");

/** Feature availability derived from the environment. */
export const capabilities = {
  /** Live database + auth are configured (browser-safe keys present). */
  supabase: Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  /** Privileged server-side Supabase access (admin writes, user management). */
  supabaseAdmin: Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    env.SUPABASE_SERVICE_ROLE_KEY,
  ),
  /** Transactional email dispatch. */
  email: Boolean(env.RESEND_API_KEY && env.EMAIL_FROM && env.EMAIL_TO_ADMIN),
  /** Third-party analytics script. */
  analytics: Boolean(env.NEXT_PUBLIC_ANALYTICS_SRC),
} as const;

export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
