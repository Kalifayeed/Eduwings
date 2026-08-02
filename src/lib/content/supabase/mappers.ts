import type {
  Article,
  ArticleCategory,
  EduEvent,
  EventType,
  GalleryCategory,
  GalleryItem,
  GalleryMediaType,
  Partner,
  PartnerCategory,
  PartnerKind,
  PartnerTier,
  ProgramModule,
  PublishStatus,
  School,
  SchoolLevel,
  Testimonial,
  TestimonialRole,
} from "@/lib/content/types";
import type { Tables } from "@/lib/supabase/database.types";

/**
 * Row → domain model translation.
 *
 * The database speaks `snake_case` and stores enumerations as text; the
 * application speaks `camelCase` and narrow union types. Confining that
 * translation to this module means the rest of the codebase never sees a raw
 * database shape, and a column rename is a single-file change.
 */

const asStatus = (value: string): PublishStatus => value as PublishStatus;

export function toArticle(row: Tables<"articles">): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category as ArticleCategory,
    tags: row.tags ?? [],
    coverImage: row.cover_image,
    authorName: row.author_name,
    authorRole: row.author_role,
    featured: row.featured,
    readingMinutes: row.reading_minutes,
    status: asStatus(row.status),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toEvent(row: Tables<"events">): EduEvent {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    body: row.body,
    type: row.type as EventType,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    venue: row.venue,
    locality: row.locality,
    isOnline: row.is_online,
    coverImage: row.cover_image,
    capacity: row.capacity,
    seatsTaken: row.seats_taken,
    registrationOpen: row.registration_open,
    priceKes: row.price_kes,
    featured: row.featured,
    status: asStatus(row.status),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toGalleryItem(row: Tables<"gallery_items">): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    caption: row.caption,
    category: row.category as GalleryCategory,
    mediaType: row.media_type as GalleryMediaType,
    url: row.url,
    videoUrl: row.video_url,
    aspectRatio: row.aspect_ratio as GalleryItem["aspectRatio"],
    takenAt: row.taken_at,
    location: row.location,
    sortOrder: row.sort_order,
    status: asStatus(row.status),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toPartner(row: Tables<"partners">): Partner {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    kind: row.kind as PartnerKind,
    tier: row.tier as PartnerTier,
    category: row.category as PartnerCategory,
    summary: row.summary,
    contribution: row.contribution,
    websiteUrl: row.website_url,
    logoUrl: row.logo_url,
    sinceYear: row.since_year,
    sortOrder: row.sort_order,
    status: asStatus(row.status),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toTestimonial(row: Tables<"testimonials">): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    authorName: row.author_name,
    authorRole: row.author_role as TestimonialRole,
    organisation: row.organisation,
    locality: row.locality,
    avatarUrl: row.avatar_url,
    featured: row.featured,
    sortOrder: row.sort_order,
    status: asStatus(row.status),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toSchool(row: Tables<"schools">): School {
  return {
    id: row.id,
    name: row.name,
    level: row.level as SchoolLevel,
    county: row.county,
    town: row.town,
    studentsReached: row.students_reached,
    firstVisitAt: row.first_visit_at,
    visitCount: row.visit_count,
    logoUrl: row.logo_url,
    status: asStatus(row.status),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toProgramModule(row: Tables<"program_modules">): ProgramModule {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    body: row.body,
    icon: row.icon,
    durationMinutes: row.duration_minutes,
    curriculumLinks: row.curriculum_links ?? [],
    learningOutcomes: row.learning_outcomes ?? [],
    sortOrder: row.sort_order,
    status: asStatus(row.status),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
