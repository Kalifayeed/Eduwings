import "server-only";

import type { ContentSource } from "@/lib/content/source";
import type { ListOptions, Paginated } from "@/lib/content/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  toArticle,
  toEvent,
  toGalleryItem,
  toPartner,
  toProgramModule,
  toSchool,
  toTestimonial,
} from "@/lib/content/supabase/mappers";
import { logger } from "@/lib/logger";

/**
 * Database-backed implementation of `ContentSource`.
 *
 * Reads go through the anon-key client so Row Level Security applies: the
 * "published rows are readable by everyone" policy is enforced by Postgres, not
 * by remembering to add a `where` clause. Admin views opt into unpublished rows,
 * which RLS grants only to authenticated staff.
 *
 * Query failures are logged and degrade to an empty result rather than throwing.
 * A transient database problem should render an empty section, not a 500 on the
 * home page.
 */

const EMPTY: Paginated<never> = { items: [], total: 0 };

function empty<T>(): Paginated<T> {
  return EMPTY as Paginated<T>;
}

/** Translate `limit`/`offset` into a PostgREST range. */
function rangeOf(options?: ListOptions): [number, number] | null {
  if (options?.limit === undefined) return null;
  const from = options.offset ?? 0;
  return [from, from + options.limit - 1];
}

function statusFilter(options?: ListOptions) {
  return options?.includeUnpublished ? null : "published";
}

export const supabaseContentSource: ContentSource = {
  kind: "supabase",

  articles: {
    async list(query) {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return empty();

      let builder = supabase
        .from("articles")
        .select("*", { count: "exact" })
        .order("published_at", { ascending: false });

      const status = statusFilter(query);
      if (status) builder = builder.eq("status", status);
      if (query?.category) builder = builder.eq("category", query.category);
      if (query?.tag) builder = builder.contains("tags", [query.tag]);
      if (query?.featured !== undefined) builder = builder.eq("featured", query.featured);
      if (query?.excludeSlug) builder = builder.neq("slug", query.excludeSlug);
      if (query?.search) {
        const term = `%${query.search}%`;
        builder = builder.or(`title.ilike.${term},excerpt.ilike.${term}`);
      }

      const range = rangeOf(query);
      if (range) builder = builder.range(range[0], range[1]);

      const { data, error, count } = await builder;
      if (error) {
        logger.error("content.articles.list", error);
        return empty();
      }
      return { items: data.map(toArticle), total: count ?? data.length };
    },

    async bySlug(slug) {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return null;

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) {
        logger.error("content.articles.bySlug", error);
        return null;
      }
      return data ? toArticle(data) : null;
    },

    async slugs() {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return [];

      const { data, error } = await supabase
        .from("articles")
        .select("slug")
        .eq("status", "published");

      if (error) {
        logger.error("content.articles.slugs", error);
        return [];
      }
      return data.map((row) => row.slug);
    },
  },

  events: {
    async list(query) {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return empty();

      const when = query?.when ?? "all";
      const nowIso = new Date().toISOString();

      let builder = supabase
        .from("events")
        .select("*", { count: "exact" })
        .order("starts_at", { ascending: when !== "past" });

      const status = statusFilter(query);
      if (status) builder = builder.eq("status", status);
      if (when === "upcoming") builder = builder.gte("starts_at", nowIso);
      if (when === "past") builder = builder.lt("starts_at", nowIso);
      if (query?.type) builder = builder.eq("type", query.type);
      if (query?.featured !== undefined) builder = builder.eq("featured", query.featured);

      const range = rangeOf(query);
      if (range) builder = builder.range(range[0], range[1]);

      const { data, error, count } = await builder;
      if (error) {
        logger.error("content.events.list", error);
        return empty();
      }
      return { items: data.map(toEvent), total: count ?? data.length };
    },

    async bySlug(slug) {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return null;

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) {
        logger.error("content.events.bySlug", error);
        return null;
      }
      return data ? toEvent(data) : null;
    },

    async slugs() {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return [];

      const { data, error } = await supabase
        .from("events")
        .select("slug")
        .eq("status", "published");

      if (error) {
        logger.error("content.events.slugs", error);
        return [];
      }
      return data.map((row) => row.slug);
    },
  },

  gallery: {
    async list(query) {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return empty();

      let builder = supabase
        .from("gallery_items")
        .select("*", { count: "exact" })
        .order("sort_order", { ascending: true });

      const status = statusFilter(query);
      if (status) builder = builder.eq("status", status);
      if (query?.category) builder = builder.eq("category", query.category);
      if (query?.mediaType) builder = builder.eq("media_type", query.mediaType);

      const range = rangeOf(query);
      if (range) builder = builder.range(range[0], range[1]);

      const { data, error, count } = await builder;
      if (error) {
        logger.error("content.gallery.list", error);
        return empty();
      }
      return { items: data.map(toGalleryItem), total: count ?? data.length };
    },
  },

  partners: {
    async list(query) {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return empty();

      let builder = supabase
        .from("partners")
        .select("*", { count: "exact" })
        .order("sort_order", { ascending: true });

      const status = statusFilter(query);
      if (status) builder = builder.eq("status", status);
      if (query?.kind) builder = builder.eq("kind", query.kind);

      const range = rangeOf(query);
      if (range) builder = builder.range(range[0], range[1]);

      const { data, error, count } = await builder;
      if (error) {
        logger.error("content.partners.list", error);
        return empty();
      }
      return { items: data.map(toPartner), total: count ?? data.length };
    },
  },

  testimonials: {
    async list(query) {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return empty();

      let builder = supabase
        .from("testimonials")
        .select("*", { count: "exact" })
        .order("sort_order", { ascending: true });

      const status = statusFilter(query);
      if (status) builder = builder.eq("status", status);
      if (query?.featured !== undefined) builder = builder.eq("featured", query.featured);

      const range = rangeOf(query);
      if (range) builder = builder.range(range[0], range[1]);

      const { data, error, count } = await builder;
      if (error) {
        logger.error("content.testimonials.list", error);
        return empty();
      }
      return { items: data.map(toTestimonial), total: count ?? data.length };
    },
  },

  schools: {
    async list(query) {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return empty();

      let builder = supabase
        .from("schools")
        .select("*", { count: "exact" })
        .order("students_reached", { ascending: false });

      const status = statusFilter(query);
      if (status) builder = builder.eq("status", status);
      if (query?.county) builder = builder.eq("county", query.county);

      const range = rangeOf(query);
      if (range) builder = builder.range(range[0], range[1]);

      const { data, error, count } = await builder;
      if (error) {
        logger.error("content.schools.list", error);
        return empty();
      }
      return { items: data.map(toSchool), total: count ?? data.length };
    },
  },

  programs: {
    async list(options) {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return empty();

      let builder = supabase
        .from("program_modules")
        .select("*", { count: "exact" })
        .order("sort_order", { ascending: true });

      const status = statusFilter(options);
      if (status) builder = builder.eq("status", status);

      const range = rangeOf(options);
      if (range) builder = builder.range(range[0], range[1]);

      const { data, error, count } = await builder;
      if (error) {
        logger.error("content.programs.list", error);
        return empty();
      }
      return { items: data.map(toProgramModule), total: count ?? data.length };
    },

    async bySlug(slug) {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return null;

      const { data, error } = await supabase
        .from("program_modules")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        logger.error("content.programs.bySlug", error);
        return null;
      }
      return data ? toProgramModule(data) : null;
    },
  },
};
