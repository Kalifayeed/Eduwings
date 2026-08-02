import type { ContentSource } from "@/lib/content/source";
import { paginate, visibleOnly } from "@/lib/content/source";
import { articles } from "@/lib/content/static/articles";
import { events } from "@/lib/content/static/events";
import { galleryItems } from "@/lib/content/static/gallery";
import { partners } from "@/lib/content/static/partners";
import { programModules } from "@/lib/content/static/programs";
import { schools } from "@/lib/content/static/schools";
import { testimonials } from "@/lib/content/static/testimonials";

/**
 * Seed-data implementation of `ContentSource`.
 *
 * Backs the entire public site when no database is configured. Sorting and
 * filtering mirror the SQL used by the Supabase implementation so that switching
 * backends produces the same page output, not merely the same types.
 */

function byPublishedDesc(a: { publishedAt: string | null }, b: { publishedAt: string | null }) {
  return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
}

function bySortOrder(a: { sortOrder: number }, b: { sortOrder: number }) {
  return a.sortOrder - b.sortOrder;
}

function matchesSearch(haystack: string[], needle: string): boolean {
  const term = needle.trim().toLowerCase();
  if (!term) return true;
  return haystack.some((value) => value.toLowerCase().includes(term));
}

export const staticContentSource: ContentSource = {
  kind: "static",

  articles: {
    async list(query) {
      let items = visibleOnly(articles, query).slice().sort(byPublishedDesc);

      if (query?.category) items = items.filter((item) => item.category === query.category);
      if (query?.tag) items = items.filter((item) => item.tags.includes(query.tag as string));
      if (query?.featured !== undefined)
        items = items.filter((item) => item.featured === query.featured);
      if (query?.excludeSlug) items = items.filter((item) => item.slug !== query.excludeSlug);
      if (query?.search) {
        items = items.filter((item) =>
          matchesSearch([item.title, item.excerpt, item.category, ...item.tags], query.search!),
        );
      }

      return paginate(items, query);
    },

    async bySlug(slug) {
      return articles.find((item) => item.slug === slug && item.status === "published") ?? null;
    },

    async slugs() {
      return articles.filter((item) => item.status === "published").map((item) => item.slug);
    },
  },

  events: {
    async list(query) {
      let items = visibleOnly(events, query).slice();
      const when = query?.when ?? "all";

      if (when !== "all") {
        const now = Date.now();
        items = items.filter((item) => {
          const reference = new Date(item.endsAt ?? item.startsAt).getTime();
          return when === "upcoming" ? reference >= now : reference < now;
        });
      }

      // Upcoming reads soonest-first; past reads most-recent-first.
      items.sort((a, b) =>
        when === "past"
          ? b.startsAt.localeCompare(a.startsAt)
          : a.startsAt.localeCompare(b.startsAt),
      );

      if (query?.type) items = items.filter((item) => item.type === query.type);
      if (query?.featured !== undefined)
        items = items.filter((item) => item.featured === query.featured);

      return paginate(items, query);
    },

    async bySlug(slug) {
      return events.find((item) => item.slug === slug && item.status === "published") ?? null;
    },

    async slugs() {
      return events.filter((item) => item.status === "published").map((item) => item.slug);
    },
  },

  gallery: {
    async list(query) {
      let items = visibleOnly(galleryItems, query).slice().sort(bySortOrder);
      if (query?.category) items = items.filter((item) => item.category === query.category);
      if (query?.mediaType) items = items.filter((item) => item.mediaType === query.mediaType);
      return paginate(items, query);
    },
  },

  partners: {
    async list(query) {
      let items = visibleOnly(partners, query).slice().sort(bySortOrder);
      if (query?.kind) items = items.filter((item) => item.kind === query.kind);
      return paginate(items, query);
    },
  },

  testimonials: {
    async list(query) {
      let items = visibleOnly(testimonials, query).slice().sort(bySortOrder);
      if (query?.featured !== undefined)
        items = items.filter((item) => item.featured === query.featured);
      return paginate(items, query);
    },
  },

  schools: {
    async list(query) {
      let items = visibleOnly(schools, query)
        .slice()
        .sort((a, b) => b.studentsReached - a.studentsReached);
      if (query?.county) items = items.filter((item) => item.county === query.county);
      return paginate(items, query);
    },
  },

  programs: {
    async list(options) {
      const items = visibleOnly(programModules, options).slice().sort(bySortOrder);
      return paginate(items, options);
    },

    async bySlug(slug) {
      return programModules.find((item) => item.slug === slug) ?? null;
    },
  },
};
