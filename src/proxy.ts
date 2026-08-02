import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { PROTECTED_PATH_PREFIX, routes } from "@/config/routes";

/**
 * Session refresh and route protection.
 *
 * This is Next.js 16's `proxy` convention — the replacement for `middleware.ts`,
 * which is deprecated. Same execution model: it runs before rendering and can
 * read and rewrite the request and response.
 *
 * Two jobs, in this order:
 *
 *  1. **Refresh the Supabase session.** Server Components cannot write cookies,
 *     so if this does not rotate the auth token, a signed-in editor is logged
 *     out the moment their access token expires. `getUser()` is what performs
 *     the refresh — hence calling it even when the result is otherwise unused.
 *
 *  2. **Guard `/admin`.** An unauthenticated request is redirected to the login
 *     page carrying a `next` parameter, so the user lands where they were going.
 *
 * Deliberate limitation: this checks only that a *valid session exists*, not
 * that the user is staff. Role checks belong in the admin layout, where they can
 * query `profiles` — and, more importantly, they are enforced by Row Level
 * Security regardless. This layer is a redirect for user experience, never the
 * authorisation boundary.
 *
 * `getUser()` is used rather than `getSession()`: the former validates the token
 * against Supabase's auth server, while the latter trusts a cookie that a client
 * could have forged.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without Supabase configured there is no session to refresh and no admin to
  // protect — the console renders its own "not configured" state.
  if (!url || !anonKey) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && pathname.startsWith(PROTECTED_PATH_PREFIX)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = routes.login;
    loginUrl.search = "";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // A signed-in user has no reason to see the login form.
  if (user && pathname === routes.login) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = routes.admin.root;
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

export const config = {
  /**
   * Run on everything except static assets and metadata files. Matching the
   * whole site (rather than just `/admin`) is required for job 1: a session that
   * is only refreshed while browsing the admin console expires while an editor
   * is reading the public site.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)",
  ],
};
