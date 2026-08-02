import type { MetadataRoute } from "next";

import { routes } from "@/config/routes";
import { siteUrl } from "@/lib/env";
import { getContentSource } from "@/lib/content";
import { careers } from "@/lib/content/careers";

/**
 * XML sitemap.
 *
 * Priorities encode what we actually want ranking: the school request page and
 * the career pathways are the pages that convert and the pages people search
 * for. `changeFrequency` is a hint rather than a promise, so it is set to what
 * is realistically true for each section rather than optimistically.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const source = getContentSource();
  const now = new Date();

  // Typed before `.map` so the literal `changeFrequency` values are not widened
  // to `string` by the spread below.
  const staticEntries: MetadataRoute.Sitemap = [
    { url: routes.home, priority: 1, changeFrequency: "weekly" },
    { url: routes.careers, priority: 0.95, changeFrequency: "monthly" },
    { url: routes.schools, priority: 0.95, changeFrequency: "monthly" },
    { url: routes.program, priority: 0.9, changeFrequency: "monthly" },
    { url: routes.about, priority: 0.8, changeFrequency: "monthly" },
    { url: routes.activities, priority: 0.8, changeFrequency: "monthly" },
    { url: routes.events, priority: 0.8, changeFrequency: "weekly" },
    { url: routes.news, priority: 0.8, changeFrequency: "weekly" },
    { url: routes.gallery, priority: 0.7, changeFrequency: "weekly" },
    { url: routes.donate, priority: 0.7, changeFrequency: "monthly" },
    { url: routes.volunteer, priority: 0.7, changeFrequency: "monthly" },
    { url: routes.partners, priority: 0.65, changeFrequency: "monthly" },
    { url: routes.sponsors, priority: 0.65, changeFrequency: "monthly" },
    { url: routes.faq, priority: 0.6, changeFrequency: "monthly" },
    { url: routes.contact, priority: 0.6, changeFrequency: "yearly" },
    { url: routes.privacy, priority: 0.2, changeFrequency: "yearly" },
    { url: routes.terms, priority: 0.2, changeFrequency: "yearly" },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticEntries.map((entry) => ({
    ...entry,
    url: `${siteUrl}${entry.url}`,
    lastModified: now,
  }));

  const careerRoutes: MetadataRoute.Sitemap = careers.map((career) => ({
    url: `${siteUrl}${routes.career(career.slug)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const [articles, events] = await Promise.all([
    source.articles.list(),
    source.events.list({ when: "all" }),
  ]);

  const articleRoutes: MetadataRoute.Sitemap = articles.items.map((article) => ({
    url: `${siteUrl}${routes.article(article.slug)}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.items.map((event) => ({
    url: `${siteUrl}${routes.event(event.slug)}`,
    lastModified: new Date(event.updatedAt),
    changeFrequency: "weekly",
    priority: new Date(event.startsAt) > now ? 0.75 : 0.4,
  }));

  return [...staticRoutes, ...careerRoutes, ...articleRoutes, ...eventRoutes];
}
