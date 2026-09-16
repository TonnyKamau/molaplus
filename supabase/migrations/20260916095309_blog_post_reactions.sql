-- Anonymous article helpfulness reactions.

begin;

create table if not exists public.blog_post_reactions (
	slug text not null,
	visitor_key text not null,
	reaction text not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	primary key (slug, visitor_key),
	constraint blog_post_reactions_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	constraint blog_post_reactions_reaction_format check (reaction in ('helpful', 'not_helpful')),
	constraint blog_post_reactions_visitor_key_format check (visitor_key ~ '^[a-zA-Z0-9_-]{16,128}$')
);

create index if not exists blog_post_reactions_slug_idx on public.blog_post_reactions (slug);

alter table public.blog_post_reactions enable row level security;
revoke all on public.blog_post_reactions from public, anon, authenticated;

create or replace function public.get_blog_post_reactions(post_slug text)
returns table(helpful bigint, not_helpful bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
	if post_slug is null or post_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
		raise exception 'Invalid blog post slug';
	end if;

	return query
		select
			count(*) filter (where reaction = 'helpful'),
			count(*) filter (where reaction = 'not_helpful')
		from public.blog_post_reactions
		where slug = post_slug;
end;
$$;

create or replace function public.record_blog_post_reaction(post_slug text, post_reaction text, post_visitor_key text)
returns table(helpful bigint, not_helpful bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
	if post_slug is null or post_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
		or post_reaction not in ('helpful', 'not_helpful')
		or post_visitor_key is null or post_visitor_key !~ '^[a-zA-Z0-9_-]{16,128}$' then
		raise exception 'Invalid blog reaction';
	end if;

	insert into public.blog_post_reactions as reactions (slug, visitor_key, reaction, updated_at)
	values (post_slug, post_visitor_key, post_reaction, now())
	on conflict (slug, visitor_key) do update
		set reaction = excluded.reaction,
				updated_at = now();

	return query
		select
			count(*) filter (where reaction = 'helpful'),
			count(*) filter (where reaction = 'not_helpful')
		from public.blog_post_reactions
		where slug = post_slug;
end;
$$;

revoke all on function public.get_blog_post_reactions(text) from public;
revoke all on function public.record_blog_post_reaction(text, text, text) from public;
grant execute on function public.get_blog_post_reactions(text) to anon, authenticated;
grant execute on function public.record_blog_post_reaction(text, text, text) to anon, authenticated;

commit;
