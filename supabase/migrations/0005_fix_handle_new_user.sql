-- Fix: handle_new_user() previously failed the entire auth.users insert
-- whenever role metadata was missing (e.g. users created via the Supabase
-- dashboard rather than the app's signup form), because it tried to insert
-- a profiles row with role = NULL, violating the not-null constraint.
-- Now it just skips creating a profile when there's no role, instead of
-- blocking user creation entirely.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.raw_user_meta_data ? 'role' then
    insert into public.profiles (id, role, full_name)
    values (
      new.id,
      (new.raw_user_meta_data ->> 'role')::user_role,
      new.raw_user_meta_data ->> 'full_name'
    );
  end if;
  return new;
end;
$$;
