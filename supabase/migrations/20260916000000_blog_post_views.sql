-- Public blog view counts.
-- Safe public increment through a narrow RPC; readers can only select counts.

begin;

create table if not exists public.blog_post_views (
  slug text primary key,
  views bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint blog_post_views_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create index if not exists blog_post_views_views_idx on public.blog_post_views (views desc);

alter table public.blog_post_views enable row level security;
revoke all on public.blog_post_views from public, anon, authenticated;
grant select on public.blog_post_views to anon, authenticated;

create policy "Readers see blog view counts" on public.blog_post_views
  for select to anon, authenticated
  using (true);

create or replace function public.increment_blog_post_view(post_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  next_views bigint;
begin
  if post_slug is null or post_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
    raise exception 'Invalid blog post slug';
  end if;

  insert into public.blog_post_views as counts (slug, views, updated_at)
  values (post_slug, 1, now())
  on conflict (slug) do update
    set views = counts.views + 1,
        updated_at = now()
  returning views into next_views;

  return next_views;
end;
$$;

revoke all on function public.increment_blog_post_view(text) from public;
grant execute on function public.increment_blog_post_view(text) to anon, authenticated;

commit;
