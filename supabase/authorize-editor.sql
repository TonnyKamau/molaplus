-- Run after creating ambwere.rodgers@gmail.com in Authentication > Users.

begin;

do $$
begin
  if not exists (select 1 from auth.users where lower(email) = lower('ambwere.rodgers@gmail.com')) then
    raise exception 'Create ambwere.rodgers@gmail.com in Authentication > Users first, then rerun this file.';
  end if;
end;
$$;

insert into public.blog_editors (user_id)
select id from auth.users where lower(email) = lower('ambwere.rodgers@gmail.com')
on conflict (user_id) do nothing;

select u.email, e.user_id
from public.blog_editors e
join auth.users u on u.id = e.user_id
where lower(u.email) = lower('ambwere.rodgers@gmail.com');

commit;
