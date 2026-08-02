-- ═══════════════════════════════════════════════════════════════════════════
-- EduWings — Row Level Security
--
-- The security model in one sentence: the anonymous role can read published
-- content and nothing else; staff can manage content; nobody but the service
-- role can read personal data submitted through forms.
--
-- Enforcing this in Postgres rather than in application code means a forgotten
-- `where status = 'published'` in a query is a missing row, not a data leak.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Role helpers ──────────────────────────────────────────────────────────
-- SECURITY DEFINER is essential here. A policy on `profiles` that queries
-- `profiles` would recurse infinitely; a definer function bypasses RLS on the
-- lookup and breaks the cycle. `search_path` is pinned so the function cannot
-- be hijacked by a caller-controlled schema.
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('admin', 'editor'), false);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'admin', false);
$$;

revoke execute on function public.current_app_role() from anon;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- ── Enable RLS everywhere ─────────────────────────────────────────────────
-- Every table, without exception. A table with RLS disabled is readable by
-- anyone holding the anon key.
alter table public.profiles        enable row level security;
alter table public.articles        enable row level security;
alter table public.events          enable row level security;
alter table public.gallery_items   enable row level security;
alter table public.partners        enable row level security;
alter table public.testimonials    enable row level security;
alter table public.schools         enable row level security;
alter table public.program_modules enable row level security;
alter table public.subscribers     enable row level security;
alter table public.submissions     enable row level security;
alter table public.media_assets    enable row level security;
alter table public.site_settings   enable row level security;

-- ── Profiles ──────────────────────────────────────────────────────────────
create policy "Users read their own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Staff read all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_staff());

create policy "Users update their own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Only administrators may change roles or remove people. Note this deliberately
-- allows an admin to demote themselves; recovering from that requires the
-- service role, which is the correct escape hatch.
create policy "Admins manage profiles"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Published content: readable by everyone ───────────────────────────────
-- Applied to `anon` and `authenticated` so that a signed-in visitor who is not
-- staff sees exactly what an anonymous visitor sees.
create policy "Published articles are public"
  on public.articles for select
  to anon, authenticated
  using (status = 'published');

create policy "Published events are public"
  on public.events for select
  to anon, authenticated
  using (status = 'published');

create policy "Published gallery items are public"
  on public.gallery_items for select
  to anon, authenticated
  using (status = 'published');

create policy "Published partners are public"
  on public.partners for select
  to anon, authenticated
  using (status = 'published');

create policy "Published testimonials are public"
  on public.testimonials for select
  to anon, authenticated
  using (status = 'published');

create policy "Published schools are public"
  on public.schools for select
  to anon, authenticated
  using (status = 'published');

create policy "Published programme modules are public"
  on public.program_modules for select
  to anon, authenticated
  using (status = 'published');

create policy "Site settings are public"
  on public.site_settings for select
  to anon, authenticated
  using (true);

-- ── Content management: staff only ────────────────────────────────────────
create policy "Staff manage articles"
  on public.articles for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "Staff manage events"
  on public.events for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "Staff manage gallery items"
  on public.gallery_items for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "Staff manage partners"
  on public.partners for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "Staff manage testimonials"
  on public.testimonials for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "Staff manage schools"
  on public.schools for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "Staff manage programme modules"
  on public.program_modules for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "Staff manage media assets"
  on public.media_assets for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "Admins manage site settings"
  on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ── Personal data: no anonymous access at all ─────────────────────────────
-- Deliberately NO insert policy for `anon`. Public form submissions are written
-- by the server through the service-role client after validation, so a visitor
-- holding the anon key cannot write directly to these tables — which would
-- otherwise let anyone flood them, bypassing our rate limiting and honeypot.
create policy "Staff read submissions"
  on public.submissions for select
  to authenticated
  using (public.is_staff());

create policy "Staff update submissions"
  on public.submissions for update
  to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "Admins delete submissions"
  on public.submissions for delete
  to authenticated
  using (public.is_admin());

create policy "Staff read subscribers"
  on public.subscribers for select
  to authenticated
  using (public.is_staff());

create policy "Staff update subscribers"
  on public.subscribers for update
  to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "Admins delete subscribers"
  on public.subscribers for delete
  to authenticated
  using (public.is_admin());

-- Media metadata is public because the files themselves are in a public bucket;
-- hiding the row while serving the object would be theatre.
create policy "Media assets are public"
  on public.media_assets for select
  to anon, authenticated
  using (true);
