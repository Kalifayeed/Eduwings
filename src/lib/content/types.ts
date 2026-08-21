/**
 * Domain models for every piece of managed content.
 *
 * These types are the contract between the content sources (seed data or
 * Supabase) and the rest of the application. Pages and components import from
 * here and never from a data provider, which is what allows the storage backend
 * to change without touching a single view.
 */

/** Editorial lifecycle shared by every CMS-managed entity. */
export type PublishStatus = "draft" | "published" | "archived";

export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

export interface Publishable {
  status: PublishStatus;
  /** ISO timestamp. Null while the record has never been published. */
  publishedAt: string | null;
}

/* ─────────────────────────────── Articles ─────────────────────────────── */

export const ARTICLE_CATEGORIES = [
  "Field Notes",
  "Student Stories",
  "Aviation Explained",
  "Programme News",
  "Careers",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export interface Article extends Timestamped, Publishable {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown. Rendered through `MarkdownContent`. */
  body: string;
  category: ArticleCategory;
  tags: string[];
  coverImage: string | null;
  authorName: string;
  authorRole: string | null;
  featured: boolean;
  readingMinutes: number;
}

/* ──────────────────────────────── Events ──────────────────────────────── */

export const EVENT_TYPES = [
  "School Visit",
  "Airport Tour",
  "Career Fair",
  "Workshop",
  "Open Day",
  "Webinar",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface EduEvent extends Timestamped, Publishable {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** Markdown. */
  body: string;
  type: EventType;
  startsAt: string;
  endsAt: string | null;
  venue: string;
  locality: string;
  isOnline: boolean;
  coverImage: string | null;
  capacity: number | null;
  seatsTaken: number;
  registrationOpen: boolean;
  priceKes: number | null;
  featured: boolean;
}

/* ──────────────────────────────── Gallery ─────────────────────────────── */

export const GALLERY_CATEGORIES = [
  "School Visits",
  "Events",
  "Aircraft",
  "Students",
  "Behind the Scenes",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type GalleryMediaType = "image" | "video";

export interface GalleryItem extends Timestamped, Publishable {
  id: string;
  title: string;
  caption: string | null;
  category: GalleryCategory;
  mediaType: GalleryMediaType;
  /** Image URL, or poster frame for a video. Null renders placeholder art. */
  url: string | null;
  /** Privacy-preserving embed URL for videos (youtube-nocookie, Vimeo, …). */
  videoUrl: string | null;
  /** Intrinsic aspect ratio; drives the masonry layout. */
  aspectRatio: "portrait" | "landscape" | "square";
  takenAt: string | null;
  location: string | null;
  sortOrder: number;
}

/* ───────────────────────── Partners and sponsors ──────────────────────── */

export type PartnerKind = "partner" | "sponsor";

export const PARTNER_TIERS = ["Founding", "Platinum", "Gold", "Silver", "Community"] as const;
export type PartnerTier = (typeof PARTNER_TIERS)[number];

export const PARTNER_CATEGORIES = [
  "Airline",
  "Airport",
  "Regulator",
  "Training Institution",
  "Corporate",
  "Foundation",
  "Media",
] as const;
export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number];

export interface Partner extends Timestamped, Publishable {
  id: string;
  slug: string;
  name: string;
  kind: PartnerKind;
  tier: PartnerTier;
  category: PartnerCategory;
  summary: string;
  /** What this organisation actually contributes — kept concrete, not generic. */
  contribution: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  sinceYear: number | null;
  sortOrder: number;
}

/* ────────────────────────────── Testimonials ──────────────────────────── */

export const TESTIMONIAL_ROLES = [
  "Student",
  "Teacher",
  "Head Teacher",
  "Parent",
  "Partner",
] as const;
export type TestimonialRole = (typeof TESTIMONIAL_ROLES)[number];

export interface Testimonial extends Timestamped, Publishable {
  id: string;
  quote: string;
  authorName: string;
  authorRole: TestimonialRole;
  /** School or organisation the speaker belongs to. */
  organisation: string;
  locality: string | null;
  avatarUrl: string | null;
  featured: boolean;
  sortOrder: number;
}

/* ──────────────────────────────── Schools ─────────────────────────────── */

export type SchoolLevel = "Primary" | "Secondary" | "Mixed";

export interface School extends Timestamped, Publishable {
  id: string;
  name: string;
  level: SchoolLevel;
  county: string;
  town: string | null;
  studentsReached: number;
  firstVisitAt: string | null;
  visitCount: number;
  logoUrl: string | null;
}

/* ──────────────────────────── Programme modules ───────────────────────── */

export interface ProgramModule extends Timestamped, Publishable {
  id: string;
  slug: string;
  title: string;
  /** One-line promise of the module. */
  summary: string;
  /** Markdown detail shown on the programme page. */
  body: string;
  /** Lucide icon name, resolved through `resolveIcon`. */
  icon: string;
  durationMinutes: number;
  /** Curriculum links, e.g. "CBC Integrated Science — Grade 7". */
  curriculumLinks: string[];
  learningOutcomes: string[];
  sortOrder: number;
}

/* ─────────────────────────── Newsletter and forms ─────────────────────── */

export type SubscriberStatus = "subscribed" | "unsubscribed";

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: SubscriberStatus;
  source: string;
  createdAt: string;
}

export const SUBMISSION_KINDS = [
  "contact",
  "volunteer",
  "school",
  "aviation-visit",
  "partnership",
  "donation",
  "event-registration",
] as const;
export type SubmissionKind = (typeof SUBMISSION_KINDS)[number];

export const SUBMISSION_STATUSES = ["new", "in-progress", "resolved", "archived"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export interface Submission {
  id: string;
  kind: SubmissionKind;
  status: SubmissionStatus;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  /** Kind-specific fields, kept schemaless so a new form needs no migration. */
  payload: Record<string, unknown>;
  createdAt: string;
}

/* ───────────────────────────── Media library ──────────────────────────── */

export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  createdAt: string;
}

/* ──────────────────────────────── Querying ────────────────────────────── */

export interface ListOptions {
  limit?: number;
  offset?: number;
  /** Admin views pass `true` to see drafts and archived records. */
  includeUnpublished?: boolean;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}
