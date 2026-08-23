-- Fixes a real bug found via QA: closeStudyIfFull/reopenStudyIfUnderCapacity
-- (src/lib/closeStudyIfFull.ts) do a plain select-then-update against
-- `studies` using whichever user's session called them. That works fine
-- when called from a researcher-initiated action (approveApplication,
-- markNoShow), but silently no-ops under RLS when called from a
-- participant-initiated one (acceptInvite, withdrawApplication) — a
-- participant has no UPDATE grant on studies. Witnessed directly:
-- withdrawing an approved application left an at-capacity study closed.
--
-- Same fix pattern as is_admin() / participant_has_applied(): move the
-- check-and-update into a SECURITY DEFINER function so it runs with the
-- function owner's privileges (bypassing RLS) regardless of who calls it.
-- Run once in Supabase SQL Editor.

create function public.close_study_if_full(target_study_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_status study_status;
  v_needed int;
  v_count int;
begin
  select status, participants_needed into v_status, v_needed
  from public.studies where id = target_study_id;

  if v_status is distinct from 'active' or v_needed is null or v_needed <= 0 then
    return;
  end if;

  select count(*) into v_count
  from public.applications
  where study_id = target_study_id
    and status in ('approved', 'scheduled', 'completed');

  if v_count >= v_needed then
    update public.studies set status = 'closed' where id = target_study_id;
  end if;
end;
$$;

create function public.reopen_study_if_under_capacity(target_study_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_status study_status;
  v_needed int;
  v_count int;
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
  end if;
end;
$$;
