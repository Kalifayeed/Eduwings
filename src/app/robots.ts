import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/env";

/**
 * Crawler directives.
 *
 * `/search` is excluded because query-string result pages generate unbounded
 * near-duplicate URLs that dilute the pages we actually want ranking. `/admin`
 * and `/api` are excluded because nothing there belongs in an index — note that
 * this is a politeness signal, not access control; those paths are protected by
 * middleware and Row Level Security.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/login", "/search"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
