/**
 * Seeds a Supabase project from the bundled editorial content.
 *
 * Run with `npm run db:seed` after applying the migrations.
 *
 * The seed data is imported from the same modules that back the static content
 * source, rather than being restated as SQL. That keeps one source of truth: the
 * site a reviewer sees with no database and the site an editor sees with one are
 * identical on day zero, and they cannot drift.
 *
 * The script is idempotent — every write is an upsert keyed on the natural
 * unique column — so running it twice is safe.
 */

import { createClient } from "@supabase/supabase-js";

import type { Database } from "../src/lib/supabase/database.types";
import { articles } from "../src/lib/content/static/articles";
import { events } from "../src/lib/content/static/events";
import { galleryItems } from "../src/lib/content/static/gallery";
import { partners } from "../src/lib/content/static/partners";
import { programModules } from "../src/lib/content/static/programs";
import { schools } from "../src/lib/content/static/schools";
import { testimonials } from "../src/lib/content/static/testimonials";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Set them in .env.local, then run: npm run db:seed",
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function step(label: string, run: () => Promise<{ error: unknown }>) {
  const { error } = await run();
  if (error) {
    console.error(`✗ ${label}`);
    console.error(error);
    process.exitCode = 1;
    return;
  }
  console.log(`✓ ${label}`);
}

async function main() {
  console.log(`Seeding ${url}\n`);

  await step(`${articles.length} articles`, async () =>
    supabase.from("articles").upsert(
      articles.map((article) => ({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        category: article.category,
        tags: article.tags,
        cover_image: article.coverImage,
        author_name: article.authorName,
        author_role: article.authorRole,
        featured: article.featured,
        reading_minutes: article.readingMinutes,
        status: article.status,
        published_at: article.publishedAt,
      })),
      { onConflict: "slug" },
    ),
  );

  await step(`${events.length} events`, async () =>
    supabase.from("events").upsert(
      events.map((event) => ({
        slug: event.slug,
        title: event.title,
        summary: event.summary,
        body: event.body,
        type: event.type,
        starts_at: event.startsAt,
        ends_at: event.endsAt,
        venue: event.venue,
        locality: event.locality,
        is_online: event.isOnline,
        cover_image: event.coverImage,
        capacity: event.capacity,
        seats_taken: event.seatsTaken,
        registration_open: event.registrationOpen,
        price_kes: event.priceKes,
        featured: event.featured,
        status: event.status,
        published_at: event.publishedAt,
      })),
      { onConflict: "slug" },
    ),
  );

  await step(`${programModules.length} programme modules`, async () =>
    supabase.from("program_modules").upsert(
      programModules.map((module) => ({
        slug: module.slug,
        title: module.title,
        summary: module.summary,
        body: module.body,
        icon: module.icon,
        duration_minutes: module.durationMinutes,
        curriculum_links: module.curriculumLinks,
        learning_outcomes: module.learningOutcomes,
        sort_order: module.sortOrder,
        status: module.status,
        published_at: module.publishedAt,
      })),
      { onConflict: "slug" },
    ),
  );

  await step(`${partners.length} partners and sponsors`, async () =>
    supabase.from("partners").upsert(
      partners.map((partner) => ({
        slug: partner.slug,
        name: partner.name,
        kind: partner.kind,
        tier: partner.tier,
        category: partner.category,
        summary: partner.summary,
        contribution: partner.contribution,
        website_url: partner.websiteUrl,
        logo_url: partner.logoUrl,
        since_year: partner.sinceYear,
        sort_order: partner.sortOrder,
        status: partner.status,
        published_at: partner.publishedAt,
      })),
      { onConflict: "slug" },
    ),
  );

  // Gallery, testimonials and schools have no natural unique key, so they are
  // seeded only when the table is empty. Re-running the script will not
  // duplicate them, and will not clobber edits made in the admin console.
  await seedIfEmpty("gallery_items", galleryItems.length, async () =>
    supabase.from("gallery_items").insert(
      galleryItems.map((item) => ({
        title: item.title,
        caption: item.caption,
        category: item.category,
        media_type: item.mediaType,
        url: item.url,
        video_url: item.videoUrl,
        aspect_ratio: item.aspectRatio,
        taken_at: item.takenAt,
        location: item.location,
        sort_order: item.sortOrder,
        status: item.status,
        published_at: item.publishedAt,
      })),
    ),
  );

  await seedIfEmpty("testimonials", testimonials.length, async () =>
    supabase.from("testimonials").insert(
      testimonials.map((item) => ({
        quote: item.quote,
        author_name: item.authorName,
        author_role: item.authorRole,
        organisation: item.organisation,
        locality: item.locality,
        avatar_url: item.avatarUrl,
        featured: item.featured,
        sort_order: item.sortOrder,
        status: item.status,
        published_at: item.publishedAt,
      })),
    ),
  );

  await seedIfEmpty("schools", schools.length, async () =>
    supabase.from("schools").insert(
      schools.map((school) => ({
        name: school.name,
        level: school.level,
        county: school.county,
        town: school.town,
        students_reached: school.studentsReached,
        first_visit_at: school.firstVisitAt,
        visit_count: school.visitCount,
        logo_url: school.logoUrl,
        status: school.status,
        published_at: school.publishedAt,
      })),
    ),
  );

  console.log("\nDone. Set a user's role to 'admin' to unlock /admin:");
  console.log("  update public.profiles set role = 'admin' where email = 'you@example.com';");
}

type SeedableTable = "gallery_items" | "testimonials" | "schools";

async function seedIfEmpty(
  table: SeedableTable,
  count: number,
  run: () => Promise<{ error: unknown }>,
) {
  const { count: existing, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error(`✗ could not inspect ${table}`);
    console.error(error);
    process.exitCode = 1;
    return;
  }

  if ((existing ?? 0) > 0) {
    console.log(`• ${table} already has ${existing} rows — skipped`);
    return;
  }

  await step(`${count} ${table.replace("_", " ")}`, run);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
