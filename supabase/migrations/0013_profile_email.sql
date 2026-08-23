-- Module 12: email notifications need an address to send to.
-- auth.users.email isn't queryable from app code (anon/authenticated
-- roles can't read the auth schema), so we mirror it onto profiles,
-- governed by the same RLS policies already protecting the rest of the
-- profile (self, the researcher/participant on the same application,
-- and admins).
-- Run once in Supabase SQL Editor.

alter table public.profiles add column email text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.raw_user_meta_data ? 'role' then
    insert into public.profiles (id, role, full_name, email)
    values (
      new.id,
      (new.raw_user_meta_data ->> 'role')::user_role,
      new.raw_user_meta_data ->> 'full_name',
      new.email
    );
  end if;
  return new;
end;
$$;

-- Backfill existing accounts created before this column existed.
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;
