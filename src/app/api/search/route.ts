import type { NextRequest } from "next/server";

import { enforceRateLimit, fail, ok } from "@/lib/api/http";
import { RATE_LIMITS } from "@/lib/rate-limit";
import { search } from "@/lib/search";

/** Search reflects live CMS content, so responses must not be cached at the edge. */
export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 80;

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request, "search", RATE_LIMITS.search);
  if (limited) return limited;

  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length > MAX_QUERY_LENGTH) {
    return fail("Search query is too long.", 400);
  }

  if (query.length < 2) {
    return ok({ query, results: [] });
  }

  const results = await search(query);
  return ok({ query, results });
}
