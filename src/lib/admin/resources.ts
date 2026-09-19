import {
  ARTICLE_CATEGORIES,
  EVENT_TYPES,
  GALLERY_CATEGORIES,
  PARTNER_CATEGORIES,
  PARTNER_TIERS,
  TESTIMONIAL_ROLES,
} from "@/lib/content/types";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Declarative CMS resource definitions.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 * Seven of the eleven admin screens are the same screen: a filterable table, a
 * create form, an edit form, a publish toggle and a delete confirmation, over a
 * different set of columns. Implementing that seven times produces seven places
 * for a bug to hide and seven forms that slowly drift apart in behaviour.
 *
 * Instead each resource is described once here, and a single pair of dynamic
 * routes — `/admin/[resource]` and `/admin/[resource]/[id]` — renders all of
 * them. Adding an eighth CMS resource is a config entry, not a directory.
 *
 * The four screens that are genuinely different (submissions, subscribers, media
 * and users) keep their own static routes, which take precedence over the
 * dynamic segment in the App Router.
 */

type TableName = keyof Database["public"]["Tables"];

export type AdminFieldType =
  | "text"
  | "slug"
  | "url"
  | "textarea"
  | "markdown"
  | "number"
  | "select"
  | "switch"
  | "date"
  | "datetime"
  | "tags"
  | "list";

export interface AdminField {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  description?: string;
  placeholder?: string;
  options?: readonly string[];
  /** Occupy the full width of the two-column form grid. */
  full?: boolean;
  rows?: number;
  /** Derive this field's value from another when it is untouched (slug ← title). */
  deriveFrom?: string;
}

export type ColumnFormat = "text" | "date" | "datetime" | "boolean" | "number" | "badge";

export interface AdminColumn {
  key: string;
  header: string;
  format?: ColumnFormat;
  /** Hide below `sm` — keeps the mobile table readable. */
  hideOnMobile?: boolean;
}

export interface AdminResource {
  /** URL segment: `/admin/<slug>`. */
  slug: string;
  table: TableName;
  label: string;
  singular: string;
  description: string;
  /** Whether the resource participates in the draft/published/archived workflow. */
  hasStatus: boolean;
  orderBy: { column: string; ascending: boolean };
  /** Columns matched by the list-view search box. */
  searchColumns: string[];
  /** Column rendered as the row's title. */
  titleColumn: string;
  /** Optional secondary line beneath the title. */
  subtitleColumn?: string;
  columns: AdminColumn[];
  fields: AdminField[];
  /** Values applied to a new record before the form is shown. */
  defaults: Record<string, unknown>;
  /**
   * Public URL for a published record, used by the "View on site" action.
   *
   * A function rather than a template because the destination can depend on the
   * row — a partner and a sponsor live on different pages despite sharing a
   * table. Functions cannot cross the server/client boundary, so client
   * components receive `AdminResourceView` (below) and are handed the resolved
   * paths separately.
   */
  publicPath?: (row: Record<string, unknown>) => string | null;
}

/**
 * The serialisable projection of a resource, safe to pass to a Client Component.
 *
 * React refuses to serialise functions across the boundary, and rightly so: a
 * closure has no meaning in the browser. Stripping the one function field here —
 * rather than in each page — means a future non-serialisable field is caught in
 * one place.
 */
export type AdminResourceView = Omit<AdminResource, "publicPath">;

export function toResourceView(resource: AdminResource): AdminResourceView {
  const view = { ...resource };
  delete (view as Partial<AdminResource>).publicPath;
  return view;
}

const STATUS_OPTIONS = ["draft", "published", "archived"] as const;

export const adminResources: AdminResource[] = [
  {
    slug: "articles",
    table: "articles",
    label: "Articles",
    singular: "Article",
    description: "Field notes, student stories, career guidance and explainers.",
    hasStatus: true,
    orderBy: { column: "published_at", ascending: false },
    searchColumns: ["title", "excerpt", "author_name"],
    titleColumn: "title",
    subtitleColumn: "excerpt",
    columns: [
      { key: "category", header: "Category", format: "badge", hideOnMobile: true },
      { key: "author_name", header: "Author", hideOnMobile: true },
      { key: "featured", header: "Featured", format: "boolean", hideOnMobile: true },
      { key: "published_at", header: "Published", format: "date" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, full: true },
      {
        name: "slug",
        label: "URL slug",
        type: "slug",
        required: true,
        deriveFrom: "title",
        description: "Appears in the address bar. Changing it breaks existing links.",
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ARTICLE_CATEGORIES,
      },
      {
        name: "excerpt",
        label: "Excerpt",
        type: "textarea",
        required: true,
        full: true,
        rows: 3,
        description: "Shown on cards and used as the meta description. Two sentences.",
      },
      {
        name: "body",
        label: "Body",
        type: "markdown",
        required: true,
        full: true,
        rows: 22,
        description:
          "Markdown. Headings, lists, links and emphasis are supported; raw HTML is not.",
      },
      { name: "author_name", label: "Author", type: "text", required: true },
      { name: "author_role", label: "Author role", type: "text" },
      {
        name: "cover_image",
        label: "Cover image URL",
        type: "url",
        full: true,
        description: "Leave blank to use generated artwork.",
      },
      { name: "tags", label: "Tags", type: "tags", full: true, description: "Comma separated." },
      { name: "reading_minutes", label: "Reading time (minutes)", type: "number" },
      { name: "featured", label: "Feature on the home page", type: "switch" },
      { name: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
    ],
    defaults: {
      category: ARTICLE_CATEGORIES[0],
      status: "draft",
      featured: false,
      reading_minutes: 5,
      tags: [],
    },
    publicPath: (row) => (row.slug ? `/news/${row.slug}` : null),
  },

  {
    slug: "events",
    table: "events",
    label: "Events",
    singular: "Event",
    description: "Open days, airport tours, career fairs, workshops and webinars.",
    hasStatus: true,
    orderBy: { column: "starts_at", ascending: false },
    searchColumns: ["title", "summary", "venue", "locality"],
    titleColumn: "title",
    subtitleColumn: "summary",
    columns: [
      { key: "type", header: "Type", format: "badge", hideOnMobile: true },
      { key: "starts_at", header: "Starts", format: "datetime" },
      { key: "locality", header: "Where", hideOnMobile: true },
      { key: "seats_taken", header: "Taken", format: "number", hideOnMobile: true },
      { key: "registration_open", header: "Open", format: "boolean", hideOnMobile: true },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, full: true },
      { name: "slug", label: "URL slug", type: "slug", required: true, deriveFrom: "title" },
      { name: "type", label: "Type", type: "select", required: true, options: EVENT_TYPES },
      { name: "summary", label: "Summary", type: "textarea", required: true, full: true, rows: 3 },
      { name: "body", label: "Details", type: "markdown", required: true, full: true, rows: 18 },
      { name: "starts_at", label: "Starts", type: "datetime", required: true },
      { name: "ends_at", label: "Ends", type: "datetime" },
      { name: "venue", label: "Venue", type: "text", required: true },
      { name: "locality", label: "Town or city", type: "text", required: true },
      { name: "is_online", label: "This is an online event", type: "switch" },
      {
        name: "capacity",
        label: "Capacity",
        type: "number",
        description: "Leave blank for no limit.",
      },
      { name: "seats_taken", label: "Places taken", type: "number" },
      {
        name: "price_kes",
        label: "Price (KES)",
        type: "number",
        description: "Leave blank when an individual quotation is required.",
      },
      { name: "cover_image", label: "Cover image URL", type: "url", full: true },
      { name: "registration_open", label: "Registration is open", type: "switch" },
      { name: "featured", label: "Feature on the home page", type: "switch" },
      { name: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
    ],
    defaults: {
      type: EVENT_TYPES[0],
      status: "draft",
      is_online: false,
      registration_open: true,
      featured: false,
      seats_taken: 0,
    },
    publicPath: (row) => (row.slug ? `/events/${row.slug}` : null),
  },

  {
    slug: "gallery",
    table: "gallery_items",
    label: "Gallery",
    singular: "Gallery item",
    description: "Photographs and film from visits, events and behind the scenes.",
    hasStatus: true,
    orderBy: { column: "sort_order", ascending: true },
    searchColumns: ["title", "caption", "location"],
    titleColumn: "title",
    subtitleColumn: "caption",
    columns: [
      { key: "category", header: "Category", format: "badge", hideOnMobile: true },
      { key: "media_type", header: "Type", hideOnMobile: true },
      { key: "location", header: "Location", hideOnMobile: true },
      { key: "sort_order", header: "Order", format: "number" },
    ],
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        full: true,
        description: "Also used as the image's alternative text.",
      },
      { name: "caption", label: "Caption", type: "textarea", full: true, rows: 2 },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: GALLERY_CATEGORIES,
      },
      {
        name: "media_type",
        label: "Media type",
        type: "select",
        required: true,
        options: ["image", "video"],
      },
      {
        name: "url",
        label: "Image URL",
        type: "url",
        full: true,
        description: "Upload in the media library, then paste the URL here.",
      },
      {
        name: "video_url",
        label: "Video embed URL",
        type: "url",
        full: true,
        description: "Use a youtube-nocookie.com or Vimeo embed URL.",
      },
      {
        name: "aspect_ratio",
        label: "Aspect ratio",
        type: "select",
        required: true,
        options: ["landscape", "portrait", "square"],
      },
      { name: "location", label: "Location", type: "text" },
      { name: "taken_at", label: "Date taken", type: "date" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
    ],
    defaults: {
      category: GALLERY_CATEGORIES[0],
      media_type: "image",
      aspect_ratio: "landscape",
      status: "draft",
      sort_order: 0,
    },
    publicPath: () => "/gallery",
  },

  {
    slug: "programs",
    table: "program_modules",
    label: "Programme",
    singular: "Module",
    description: "The curriculum modules delivered in schools.",
    hasStatus: true,
    orderBy: { column: "sort_order", ascending: true },
    searchColumns: ["title", "summary"],
    titleColumn: "title",
    subtitleColumn: "summary",
    columns: [
      { key: "duration_minutes", header: "Minutes", format: "number", hideOnMobile: true },
      { key: "sort_order", header: "Order", format: "number" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, full: true },
      { name: "slug", label: "URL slug", type: "slug", required: true, deriveFrom: "title" },
      {
        name: "icon",
        label: "Icon name",
        type: "text",
        description: "A Lucide icon name, e.g. Compass or Wind.",
      },
      { name: "summary", label: "Summary", type: "textarea", required: true, full: true, rows: 2 },
      { name: "body", label: "Body", type: "markdown", required: true, full: true, rows: 16 },
      { name: "duration_minutes", label: "Duration (minutes)", type: "number", required: true },
      { name: "sort_order", label: "Sort order", type: "number" },
      {
        name: "curriculum_links",
        label: "Curriculum links",
        type: "list",
        full: true,
        description: "One per line.",
      },
      {
        name: "learning_outcomes",
        label: "Learning outcomes",
        type: "list",
        full: true,
        description: "One per line.",
      },
      { name: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
    ],
    defaults: {
      status: "draft",
      icon: "Plane",
      duration_minutes: 45,
      sort_order: 0,
      curriculum_links: [],
      learning_outcomes: [],
    },
    publicPath: (row) => (row.slug ? `/program#${row.slug}` : "/program"),
  },

  {
    slug: "partners",
    table: "partners",
    label: "Partners & sponsors",
    singular: "Organisation",
    description: "Airlines, airports, regulators, institutions and funders.",
    hasStatus: true,
    orderBy: { column: "sort_order", ascending: true },
    searchColumns: ["name", "summary", "contribution"],
    titleColumn: "name",
    subtitleColumn: "summary",
    columns: [
      { key: "kind", header: "Kind", format: "badge" },
      { key: "tier", header: "Tier", hideOnMobile: true },
      { key: "category", header: "Category", hideOnMobile: true },
      { key: "since_year", header: "Since", format: "number", hideOnMobile: true },
    ],
    fields: [
      { name: "name", label: "Organisation name", type: "text", required: true, full: true },
      { name: "slug", label: "URL slug", type: "slug", required: true, deriveFrom: "name" },
      {
        name: "kind",
        label: "Kind",
        type: "select",
        required: true,
        options: ["partner", "sponsor"],
      },
      { name: "tier", label: "Tier", type: "select", required: true, options: PARTNER_TIERS },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: PARTNER_CATEGORIES,
      },
      { name: "since_year", label: "Working with us since", type: "number" },
      { name: "summary", label: "Summary", type: "textarea", required: true, full: true, rows: 2 },
      {
        name: "contribution",
        label: "What they contribute",
        type: "textarea",
        required: true,
        full: true,
        rows: 3,
        description: "Be concrete. This is the field prospective partners actually read.",
      },
      { name: "website_url", label: "Website", type: "url" },
      { name: "logo_url", label: "Logo URL", type: "url" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
    ],
    defaults: {
      kind: "partner",
      tier: "Community",
      category: PARTNER_CATEGORIES[0],
      status: "draft",
      sort_order: 0,
    },
    publicPath: (row) => (row.kind === "sponsor" ? "/sponsors" : "/partners"),
  },

  {
    slug: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Quotations from head teachers, students, parents and volunteers.",
    hasStatus: true,
    orderBy: { column: "sort_order", ascending: true },
    searchColumns: ["quote", "author_name", "organisation"],
    titleColumn: "author_name",
    subtitleColumn: "quote",
    columns: [
      { key: "author_role", header: "Role", format: "badge", hideOnMobile: true },
      { key: "organisation", header: "Organisation", hideOnMobile: true },
      { key: "featured", header: "Featured", format: "boolean" },
      { key: "sort_order", header: "Order", format: "number", hideOnMobile: true },
    ],
    fields: [
      {
        name: "quote",
        label: "Quotation",
        type: "textarea",
        required: true,
        full: true,
        rows: 5,
        description: "Do not add surrounding quotation marks — the design adds them.",
      },
      { name: "author_name", label: "Name", type: "text", required: true },
      {
        name: "author_role",
        label: "Role",
        type: "select",
        required: true,
        options: TESTIMONIAL_ROLES,
      },
      { name: "organisation", label: "School or organisation", type: "text", required: true },
      { name: "locality", label: "County or town", type: "text" },
      { name: "avatar_url", label: "Photograph URL", type: "url", full: true },
      { name: "featured", label: "Feature on the home page", type: "switch" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
    ],
    defaults: {
      author_role: TESTIMONIAL_ROLES[0],
      status: "draft",
      featured: false,
      sort_order: 0,
    },
  },

  {
    slug: "schools",
    table: "schools",
    label: "Schools",
    singular: "School",
    description: "The register of schools the programme has reached.",
    hasStatus: true,
    orderBy: { column: "students_reached", ascending: false },
    searchColumns: ["name", "county", "town"],
    titleColumn: "name",
    subtitleColumn: "county",
    columns: [
      { key: "level", header: "Level", format: "badge", hideOnMobile: true },
      { key: "county", header: "County", hideOnMobile: true },
      { key: "students_reached", header: "Students", format: "number" },
      { key: "visit_count", header: "Visits", format: "number", hideOnMobile: true },
      { key: "first_visit_at", header: "First visit", format: "date", hideOnMobile: true },
    ],
    fields: [
      { name: "name", label: "School name", type: "text", required: true, full: true },
      {
        name: "level",
        label: "Level",
        type: "select",
        required: true,
        options: ["Primary", "Secondary", "Mixed"],
      },
      { name: "county", label: "County", type: "text", required: true },
      { name: "town", label: "Town or ward", type: "text" },
      { name: "students_reached", label: "Students reached", type: "number" },
      { name: "visit_count", label: "Number of visits", type: "number" },
      { name: "first_visit_at", label: "First visit", type: "date" },
      { name: "logo_url", label: "Logo URL", type: "url", full: true },
      { name: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
    ],
    defaults: {
      level: "Secondary",
      status: "draft",
      students_reached: 0,
      visit_count: 1,
    },
    publicPath: () => "/schools",
  },
];

export const adminResourcesBySlug = new Map(
  adminResources.map((resource) => [resource.slug, resource]),
);

export function getAdminResource(slug: string): AdminResource | undefined {
  return adminResourcesBySlug.get(slug);
}
