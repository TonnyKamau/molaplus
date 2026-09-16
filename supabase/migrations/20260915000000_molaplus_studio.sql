-- MolaPlus studio publishing tables.
-- Run through the Supabase CLI or paste into the SQL editor before deploying the Edge Function.

begin;

grant usage on schema public to anon, authenticated, service_role;

create table if not exists public.blog_editors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.blog_editors enable row level security;
revoke all on public.blog_editors from public, anon, authenticated;
grant select on public.blog_editors to authenticated, service_role;

drop policy if exists "Editors check their own access" on public.blog_editors;
create policy "Editors check their own access" on public.blog_editors
  for select to authenticated
  using (user_id = (select auth.uid()));

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  record jsonb not null,
  revision integer not null default 1,
  archived boolean not null default false,
  published boolean not null default false,
  published_at text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint blog_posts_record_shape check (
    jsonb_typeof(record) = 'object'
    and record ?& array['id', 'draft', 'archived', 'revision', 'updatedAt', 'createdAt']
    and record->>'id' = id::text
    and (slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
  )
);

create index if not exists blog_posts_updated_idx on public.blog_posts (updated_at desc);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_public_idx on public.blog_posts (published_at desc, slug) where published and not archived;

alter table public.blog_posts enable row level security;
revoke all on public.blog_posts from public, anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant select, insert, update, delete on public.blog_posts to service_role;

drop policy if exists "Readers see published MolaPlus stories" on public.blog_posts;
create policy "Readers see published MolaPlus stories" on public.blog_posts
  for select to anon, authenticated
  using (published and not archived);

create table if not exists public.blog_revisions (
  id bigint generated always as identity primary key,
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  content jsonb not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index if not exists blog_revisions_post_idx on public.blog_revisions (post_id, id desc);

alter table public.blog_revisions enable row level security;
revoke all on public.blog_revisions from public, anon, authenticated;
grant select, insert, delete on public.blog_revisions to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('molaplus-blog-images', 'molaplus-blog-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads MolaPlus blog images" on storage.objects;
create policy "Public reads MolaPlus blog images" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'molaplus-blog-images');

drop policy if exists "Editors upload MolaPlus blog images" on storage.objects;
create policy "Editors upload MolaPlus blog images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'molaplus-blog-images'
    and exists (select 1 from public.blog_editors where user_id = (select auth.uid()))
  );

commit;
