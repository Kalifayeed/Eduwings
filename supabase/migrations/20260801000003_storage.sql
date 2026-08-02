-- ═══════════════════════════════════════════════════════════════════════════
-- EduWings — storage
--
-- A single public bucket for CMS-managed media. Public read is intentional:
-- these are marketing images served from `<img>` tags and referenced in
-- OpenGraph metadata, so signed URLs would break caching and social previews
-- for no security benefit. Writes remain staff-only.
--
-- The 10 MB ceiling and MIME allow-list are enforced by Storage itself rather
-- than by the upload UI, so they cannot be bypassed by calling the API directly.
-- ═══════════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml', 'video/mp4']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "Media is publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "Staff upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_staff());

create policy "Staff update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

create policy "Staff delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_staff());
