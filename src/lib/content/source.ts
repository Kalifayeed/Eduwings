import type {
  Article,
  ArticleCategory,
  EduEvent,
  EventType,
  GalleryCategory,
  GalleryItem,
  GalleryMediaType,
  ListOptions,
  Paginated,
  Partner,
  PartnerKind,
  ProgramModule,
  School,
  Testimonial,
} from "@/lib/content/types";

/**
 * The content access contract.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 * EduWings must satisfy two requirements that pull in opposite directions: it
 * has to run and build with no configuration at all (a fresh clone, a CI job, a
 * reviewer with no credentials), and it has to be backed by a real, editable
 * database in production.
 *
 * Resolving that with `if (supabase) … else …` scattered through page components
 * would be unmaintainable. Instead every read goes through this interface, and a
 * single factory decides which implementation backs it:
 *
 *   • `StaticContentSource`   — typed seed content compiled into the bundle
 *   • `SupabaseContentSource` — live rows from Postgres
 *
 * Pages import `getContentSource()` and are entirely unaware of which is active.
 * Adding a third source later (a headless CMS, a cache layer) requires no change
 * above this line.
 *
 * Every method is asynchronous even in the static implementation, so that the
 * call sites are already shaped correctly for a network-backed source.
 */

export interface ArticleQuery extends ListOptions {
  category?: ArticleCategory;
  tag?: string;
  featured?: boolean;
  /** Free-text match across title, excerpt and tags. */
  search?: string;
  /** Exclude a slug — used to build "related articles". */
  excludeSlug?: string;
}

export interface EventQuery extends ListOptions {
  type?: EventType;
  /** `upcoming` filters to events starting after now; `past` inverts it. */
  when?: "upcoming" | "past" | "all";
  featured?: boolean;
}

export interface GalleryQuery extends ListOptions {
  category?: GalleryCategory;
  mediaType?: GalleryMediaType;
}

export interface PartnerQuery extends ListOptions {
  kind?: PartnerKind;
}

export interface TestimonialQuery extends ListOptions {
  featured?: boolean;
}

export interface SchoolQuery extends ListOptions {
  county?: string;
}

export interface ContentSource {
  /** Which backend is active. Surfaced in the admin console for operators. */
  readonly kind: "static" | "supabase";

  articles: {
    list(query?: ArticleQuery): Promise<Paginated<Article>>;
    bySlug(slug: string): Promise<Article | null>;
    slugs(): Promise<string[]>;
  };

  events: {
    list(query?: EventQuery): Promise<Paginated<EduEvent>>;
    bySlug(slug: string): Promise<EduEvent | null>;
    slugs(): Promise<string[]>;
  };

  gallery: {
    list(query?: GalleryQuery): Promise<Paginated<GalleryItem>>;
  };

  partners: {
    list(query?: PartnerQuery): Promise<Paginated<Partner>>;
  };

  testimonials: {
    list(query?: TestimonialQuery): Promise<Paginated<Testimonial>>;
  };

  schools: {
    list(query?: SchoolQuery): Promise<Paginated<School>>;
  };

  programs: {
    list(options?: ListOptions): Promise<Paginated<ProgramModule>>;
    bySlug(slug: string): Promise<ProgramModule | null>;
  };
}

/** Apply the shared `limit`/`offset` window and report the pre-window total. */
export function paginate<T>(items: T[], options?: ListOptions): Paginated<T> {
  const total = items.length;
  const offset = options?.offset ?? 0;
  const limit = options?.limit;
  const windowed = limit === undefined ? items.slice(offset) : items.slice(offset, offset + limit);
  return { items: windowed, total };
}

/** Published records only, unless the caller is an admin view. */
export function visibleOnly<T extends { status: string }>(items: T[], options?: ListOptions): T[] {
  return options?.includeUnpublished ? items : items.filter((item) => item.status === "published");
}
