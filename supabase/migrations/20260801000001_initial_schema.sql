-- ═══════════════════════════════════════════════════════════════════════════
-- EduWings — initial schema
--
-- Mirrors src/lib/supabase/database.types.ts. If you change one, change both;
-- or regenerate the types from the live schema with:
--   npx supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts
--
-- Conventions used throughout:
--   • snake_case columns, plural table names
--   • timestamptz everywhere — never a naive timestamp
--   • `status` + `published_at` on every editorially managed table, so the
--     draft / published / archived lifecycle is uniform and RLS can key off it
--   • an `updated_at` trigger rather than trusting the application to set it
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Enumerations ──────────────────────────────────────────────────────────
create type public.publish_status as enum ('draft', 'published', 'archived');
create type public.app_role as enum ('admin', 'editor', 'viewer');
create type public.subscriber_status as enum ('subscribed', 'unsubscribed');
create type public.submission_status as enum ('new', 'in-progress', 'resolved', 'archived');

-- ── Shared trigger ────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Profiles ──────────────────────────────────────────────────────────────
-- One row per auth user. Roles live here rather than in JWT claims so that an
-- administrator can change someone's access without waiting for a token to
-- expire.
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  role public.app_role not null default 'viewer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Automatically provision a profile whenever a user is created in auth.users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Articles ──────────────────────────────────────────────────────────────
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body text not null,
  category text not null,
  tags text[] not null default '{}',
  cover_image text,
  author_name text not null,
  author_role text,
  featured boolean not null default false,
  reading_minutes integer not null default 1 check (reading_minutes > 0),
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_status_published_at_idx
  on public.articles (status, published_at desc);
create index articles_category_idx on public.articles (category);
create index articles_tags_idx on public.articles using gin (tags);

create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- ── Events ────────────────────────────────────────────────────────────────
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body text not null,
  type text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text not null,
  locality text not null,
  is_online boolean not null default false,
  cover_image text,
  capacity integer check (capacity is null or capacity > 0),
  seats_taken integer not null default 0 check (seats_taken >= 0),
  registration_open boolean not null default true,
  price_kes integer check (price_kes is null or price_kes >= 0),
  featured boolean not null default false,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- An event cannot end before it starts.
  constraint events_ends_after_starts check (ends_at is null or ends_at >= starts_at)
);

create index events_status_starts_at_idx on public.events (status, starts_at);

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ── Gallery ───────────────────────────────────────────────────────────────
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text,
  category text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  url text,
  video_url text,
  aspect_ratio text not null default 'landscape'
    check (aspect_ratio in ('portrait', 'landscape', 'square')),
  taken_at date,
  location text,
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gallery_items_status_sort_idx
  on public.gallery_items (status, sort_order);

create trigger gallery_items_set_updated_at
  before update on public.gallery_items
  for each row execute function public.set_updated_at();

-- ── Partners and sponsors ─────────────────────────────────────────────────
-- One table, discriminated by `kind`. Partners and sponsors share every column
-- and differ only in how they are grouped for display; two tables would mean
-- duplicating the schema and every policy.
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  kind text not null default 'partner' check (kind in ('partner', 'sponsor')),
  tier text not null default 'Community',
  category text not null,
  summary text not null,
  contribution text not null,
  website_url text,
  logo_url text,
  since_year integer check (since_year is null or since_year between 1900 and 2200),
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index partners_kind_sort_idx on public.partners (kind, sort_order);

create trigger partners_set_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

-- ── Testimonials ──────────────────────────────────────────────────────────
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text not null,
  organisation text not null,
  locality text,
  avatar_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index testimonials_status_sort_idx
  on public.testimonials (status, sort_order);

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ── Schools ───────────────────────────────────────────────────────────────
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level text not null default 'Secondary' check (level in ('Primary', 'Secondary', 'Mixed')),
  county text not null,
  town text,
  students_reached integer not null default 0 check (students_reached >= 0),
  first_visit_at date,
  visit_count integer not null default 0 check (visit_count >= 0),
  logo_url text,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index schools_county_idx on public.schools (county);
create index schools_status_students_idx
  on public.schools (status, students_reached desc);

create trigger schools_set_updated_at
  before update on public.schools
  for each row execute function public.set_updated_at();

-- ── Programme modules ─────────────────────────────────────────────────────
create table public.program_modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body text not null,
  icon text not null default 'Plane',
  duration_minutes integer not null default 45 check (duration_minutes > 0),
  curriculum_links text[] not null default '{}',
  learning_outcomes text[] not null default '{}',
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index program_modules_sort_idx on public.program_modules (sort_order);

create trigger program_modules_set_updated_at
  before update on public.program_modules
  for each row execute function public.set_updated_at();

-- ── Newsletter subscribers ────────────────────────────────────────────────
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  status public.subscriber_status not null default 'subscribed',
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create index subscribers_status_idx on public.subscribers (status);

-- ── Form submissions ──────────────────────────────────────────────────────
-- `payload` is jsonb so that adding a form never requires a migration. The
-- columns promoted out of it are the ones the admin console filters and sorts on.
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  status public.submission_status not null default 'new',
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index submissions_kind_created_idx on public.submissions (kind, created_at desc);
create index submissions_status_idx on public.submissions (status);

-- ── Media library ─────────────────────────────────────────────────────────
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  url text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  width integer,
  height integer,
  alt_text text,
  created_at timestamptz not null default now()
);

create index media_assets_created_idx on public.media_assets (created_at desc);

-- ── Site settings ─────────────────────────────────────────────────────────
-- A key/value store for operational toggles the team should be able to change
-- without a deployment.
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (key, value) values
  ('announcement', '{"enabled": false, "message": "", "href": ""}'::jsonb),
  ('school_requests_open', '{"enabled": true}'::jsonb)
on conflict (key) do nothing;
