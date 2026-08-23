-- Fixes infinite recursion introduced by migration 0014: its two new
-- `studies` SELECT policies queried `applications` / `study_invitations`
-- directly, and those tables' own policies query back into `studies` to
-- check researcher ownership — an RLS cycle (Postgres error 42P17).
-- Same fix pattern as is_admin() in 0011_admin.sql: wrap the check in a
-- SECURITY DEFINER function so its inner query bypasses RLS instead of
-- re-triggering it.
-- Run once in Supabase SQL Editor.

drop policy "Participants can view studies they've applied to" on public.studies;
drop policy "Anyone can view studies referenced by an invitation" on public.studies;

create function public.participant_has_applied(target_study_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.applications
    where study_id = target_study_id and participant_id = auth.uid()
  );
$$;

create function public.study_has_invitation(target_study_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.study_invitations
    where study_id = target_study_id
  );
$$;

create policy "Participants can view studies they've applied to"
  on public.studies for select
  using (public.participant_has_applied(id));

create policy "Anyone can view studies referenced by an invitation"
  on public.studies for select
  using (public.study_has_invitation(id));
