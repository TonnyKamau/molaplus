-- Public article comments.

begin;

create table if not exists public.blog_post_comments (
	id uuid primary key default gen_random_uuid(),
	slug text not null,
	author_name text not null,
	body text not null,
	created_at timestamptz not null default now(),
	constraint blog_post_comments_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	constraint blog_post_comments_author_length check (char_length(author_name) between 2 and 80),
	constraint blog_post_comments_body_length check (char_length(body) between 2 and 2000)
);

create index if not exists blog_post_comments_slug_created_idx
	on public.blog_post_comments (slug, created_at desc);

alter table public.blog_post_comments enable row level security;
revoke all on public.blog_post_comments from public, anon, authenticated;

create or replace function public.get_blog_post_comments(post_slug text)
returns table(id uuid, author_name text, body text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
	if post_slug is null or post_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
		raise exception 'Invalid blog post slug';
	end if;

	return query
		select comments.id, comments.author_name, comments.body, comments.created_at
		from public.blog_post_comments as comments
		where comments.slug = post_slug
		order by comments.created_at desc
		limit 100;
end;
$$;

create or replace function public.create_blog_post_comment(post_slug text, post_author_name text, post_body text)
returns table(id uuid, author_name text, body text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
	created_comment public.blog_post_comments;
begin
	if post_slug is null or post_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
		or post_author_name is null or char_length(btrim(post_author_name)) not between 2 and 80
		or post_body is null or char_length(btrim(post_body)) not between 2 and 2000 then
		raise exception 'Invalid comment';
	end if;

	insert into public.blog_post_comments (slug, author_name, body)
	values (post_slug, btrim(post_author_name), btrim(post_body))
	returning * into created_comment;

	return query
		select created_comment.id, created_comment.author_name, created_comment.body, created_comment.created_at;
end;
$$;

revoke all on function public.get_blog_post_comments(text) from public;
revoke all on function public.create_blog_post_comment(text, text, text) from public;
grant execute on function public.get_blog_post_comments(text) to anon, authenticated;
grant execute on function public.create_blog_post_comment(text, text, text) to anon, authenticated;

commit;
