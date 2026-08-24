-- Participant referral tracking. A participant's own profile id doubles as
-- their referral code (no separate code column needed) — the signup link
-- is /signup?role=participant&ref=<their-user-id>.
alter table profiles add column referred_by uuid references profiles(id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  ref_id uuid;
begin
  if new.raw_user_meta_data ? 'role' then
    -- A tampered or stale ?ref= value should never block signup — only use
    -- it if it's a well-formed uuid that actually belongs to a profile.
    ref_id := case
      when new.raw_user_meta_data ->> 'referred_by'
        ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      then (new.raw_user_meta_data ->> 'referred_by')::uuid
      else null
    end;

    if ref_id is not null and not exists (
      select 1 from public.profiles where id = ref_id
    ) then
      ref_id := null;
    end if;

    insert into public.profiles (id, role, full_name, referred_by)
    values (
      new.id,
      (new.raw_user_meta_data ->> 'role')::user_role,
      new.raw_user_meta_data ->> 'full_name',
      ref_id
    );
  end if;
  return new;
end;
$$;

-- profiles RLS only lets a user see their own row, so a plain client-side
-- select on referred_by would always return zero. This returns just a
-- count for the caller's own referrals, without exposing anyone's data.
create or replace function public.count_my_referrals()
returns int
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::int from public.profiles where referred_by = auth.uid();
$$;

grant execute on function public.count_my_referrals() to authenticated;
