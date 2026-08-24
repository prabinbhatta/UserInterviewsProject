-- Fix a regression from 0027: that migration's handle_new_user() rewrite
-- dropped the `email` column that 0013 had added, so every signup since
-- then has a NULL profiles.email. Restore it and backfill.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  ref_id uuid;
begin
  if new.raw_user_meta_data ? 'role' then
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

    insert into public.profiles (id, role, full_name, email, referred_by)
    values (
      new.id,
      (new.raw_user_meta_data ->> 'role')::user_role,
      new.raw_user_meta_data ->> 'full_name',
      new.email,
      ref_id
    );
  end if;
  return new;
end;
$$;

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

-- Feature: participant search for researchers. Returns only the columns
-- a researcher legitimately needs to decide who to invite — never email,
-- which stays server-side until an actual invite is created.
create or replace function public.search_participants(
  p_district text default null,
  p_min_age int default null,
  p_max_age int default null,
  p_device text default null,
  p_language text default null,
  p_limit int default 50
)
returns table (
  id uuid,
  full_name text,
  district text,
  age int,
  occupation text,
  languages text[],
  devices text[]
)
language sql
security definer
set search_path = public
stable
as $$
  select p.id, p.full_name, pp.district, pp.age, pp.occupation, pp.languages, pp.devices
  from public.profiles p
  join public.participant_profiles pp on pp.user_id = p.id
  where p.role = 'participant'
    and exists (
      select 1 from public.profiles r where r.id = auth.uid() and r.role = 'researcher'
    )
    and (p_district is null or pp.district = p_district)
    and (p_min_age is null or pp.age >= p_min_age)
    and (p_max_age is null or pp.age <= p_max_age)
    and (p_device is null or p_device = any(pp.devices))
    and (p_language is null or p_language = any(pp.languages))
  order by p.created_at desc
  limit p_limit;
$$;

grant execute on function public.search_participants(text, int, int, text, text, int)
  to authenticated;

-- Looks up contact details for a single participant, gated to callers who
-- are themselves a researcher. Used only to create a study_invitations
-- row server-side — the email is never sent to the browser.
create or replace function public.get_participant_contact(p_participant_id uuid)
returns table (email text, full_name text)
language sql
security definer
set search_path = public
stable
as $$
  select email, full_name from public.profiles
  where id = p_participant_id and role = 'participant'
    and exists (
      select 1 from public.profiles r where r.id = auth.uid() and r.role = 'researcher'
    );
$$;

grant execute on function public.get_participant_contact(uuid) to authenticated;

-- Feature: waitlist for full studies.
create table public.study_waitlist (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references public.studies (id) on delete cascade,
  participant_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (study_id, participant_id)
);

alter table public.study_waitlist enable row level security;

create policy "Participants manage own waitlist entries"
  on public.study_waitlist for all
  using (auth.uid() = participant_id)
  with check (auth.uid() = participant_id);

create policy "Researchers view waitlist for own studies"
  on public.study_waitlist for select
  using (
    exists (
      select 1 from public.studies s
      where s.id = study_waitlist.study_id and s.researcher_id = auth.uid()
    )
  );

-- Redefine reopen_study_if_under_capacity to also pop and return the
-- waitlist, but ONLY when it just performed a genuine closed->active
-- transition in this same call — never on a no-op call. That keeps this
-- SECURITY DEFINER function from being usable to harvest waitlisted
-- participants' emails on demand.
drop function if exists public.reopen_study_if_under_capacity(uuid);

create function public.reopen_study_if_under_capacity(target_study_id uuid)
returns table (participant_id uuid, email text, full_name text)
language plpgsql
security definer set search_path = public
as $$
declare
  v_status study_status;
  v_needed int;
  v_count int;
  v_reopened boolean := false;
begin
  select status, participants_needed into v_status, v_needed
  from public.studies where id = target_study_id;

  if v_status is distinct from 'closed' or v_needed is null or v_needed <= 0 then
    return;
  end if;

  select count(*) into v_count
  from public.applications
  where study_id = target_study_id
    and status in ('approved', 'scheduled', 'completed');

  if v_count < v_needed then
    update public.studies set status = 'active' where id = target_study_id;
    v_reopened := true;
  end if;

  if v_reopened then
    return query
      delete from public.study_waitlist w
      using public.profiles p
      where w.study_id = target_study_id and w.participant_id = p.id
      returning w.participant_id, p.email, p.full_name;
  end if;
end;
$$;

grant execute on function public.reopen_study_if_under_capacity(uuid) to anon, authenticated;
