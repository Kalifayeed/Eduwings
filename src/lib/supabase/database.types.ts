/**
 * Database contract.
 *
 * Hand-authored to mirror `supabase/migrations`. Rather than spelling out Row,
 * Insert and Update for every table, each row shape is declared once and the
 * other two are derived: `Insert` makes database-generated columns optional,
 * `Update` makes everything optional. This removes the most common source of
 * drift in generated-type files — the three variants disagreeing with each other.
 *
 * Once a Supabase project exists you can regenerate this file from the live
 * schema with:
 *   npx supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts
 */

export type PublishStatusEnum = "draft" | "published" | "archived";
export type AppRole = "admin" | "editor" | "viewer";
export type SubscriberStatusEnum = "subscribed" | "unsubscribed";
export type SubmissionStatusEnum = "new" | "in-progress" | "resolved" | "archived";
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

/** Columns the database fills in for us on insert. */
type Generated = "id" | "created_at" | "updated_at";

type TableDefinition<Row, Optional extends keyof Row = never> = {
  Row: Row;
  Insert: Omit<Row, Optional> & Partial<Pick<Row, Optional>>;
  Update: Partial<Row>;
  Relationships: [];
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  cover_image: string | null;
  author_name: string;
  author_role: string | null;
  featured: boolean;
  reading_minutes: number;
  status: PublishStatusEnum;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type EventRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  type: string;
  starts_at: string;
  ends_at: string | null;
  venue: string;
  locality: string;
  is_online: boolean;
  cover_image: string | null;
  capacity: number | null;
  seats_taken: number;
  registration_open: boolean;
  price_kes: number | null;
  featured: boolean;
  status: PublishStatusEnum;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type GalleryItemRow = {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  media_type: string;
  url: string | null;
  video_url: string | null;
  aspect_ratio: string;
  taken_at: string | null;
  location: string | null;
  sort_order: number;
  status: PublishStatusEnum;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type PartnerRow = {
  id: string;
  slug: string;
  name: string;
  kind: string;
  tier: string;
  category: string;
  summary: string;
  contribution: string;
  website_url: string | null;
  logo_url: string | null;
  since_year: number | null;
  sort_order: number;
  status: PublishStatusEnum;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type TestimonialRow = {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  organisation: string;
  locality: string | null;
  avatar_url: string | null;
  featured: boolean;
  sort_order: number;
  status: PublishStatusEnum;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type SchoolRow = {
  id: string;
  name: string;
  level: string;
  county: string;
  town: string | null;
  students_reached: number;
  first_visit_at: string | null;
  visit_count: number;
  logo_url: string | null;
  status: PublishStatusEnum;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type ProgramModuleRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  icon: string;
  duration_minutes: number;
  curriculum_links: string[];
  learning_outcomes: string[];
  sort_order: number;
  status: PublishStatusEnum;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type SubscriberRow = {
  id: string;
  email: string;
  name: string | null;
  status: SubscriberStatusEnum;
  source: string;
  created_at: string;
};

type SubmissionRow = {
  id: string;
  kind: string;
  status: SubmissionStatusEnum;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  payload: Json;
  created_at: string;
};

type MediaAssetRow = {
  id: string;
  file_name: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  created_at: string;
};

type SiteSettingRow = {
  key: string;
  value: Json;
  updated_at: string;
};

export type Database = {
  /** Consumed by postgrest-js to pick its result-type inference strategy. */
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      profiles: TableDefinition<ProfileRow, "created_at" | "updated_at">;
      articles: TableDefinition<ArticleRow, Generated | "tags" | "featured" | "reading_minutes">;
      events: TableDefinition<EventRow, Generated | "seats_taken" | "featured">;
      gallery_items: TableDefinition<GalleryItemRow, Generated | "sort_order">;
      partners: TableDefinition<PartnerRow, Generated | "sort_order">;
      testimonials: TableDefinition<TestimonialRow, Generated | "sort_order" | "featured">;
      schools: TableDefinition<SchoolRow, Generated | "visit_count" | "students_reached">;
      program_modules: TableDefinition<ProgramModuleRow, Generated | "sort_order">;
      subscribers: TableDefinition<SubscriberRow, "id" | "created_at" | "status">;
      submissions: TableDefinition<SubmissionRow, "id" | "created_at" | "status">;
      media_assets: TableDefinition<MediaAssetRow, "id" | "created_at">;
      site_settings: TableDefinition<SiteSettingRow, "updated_at">;
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      publish_status: PublishStatusEnum;
      app_role: AppRole;
      subscriber_status: SubscriberStatusEnum;
      submission_status: SubmissionStatusEnum;
    };
    CompositeTypes: Record<never, never>;
  };
};

/** Convenience aliases used by the mappers. */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
