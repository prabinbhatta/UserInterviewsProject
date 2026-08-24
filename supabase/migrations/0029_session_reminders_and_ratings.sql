-- Feature: session reminder emails.
alter table public.study_slots
  add column reminder_sent boolean not null default false;

-- No RLS policy grants a cron job (no logged-in user) read access across
-- every participant's booked slots — this SECURITY DEFINER function is
-- the only way in. It atomically selects and marks slots as reminded in
-- the same call, so two overlapping cron runs can't double-send.
create or replace function public.pop_due_session_reminders(window_minutes int)
returns table (
  slot_id uuid,
  starts_at timestamptz,
  study_title text,
  participant_email text,
  participant_name text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    update public.study_slots s
    set reminder_sent = true
    from public.studies st, public.applications a, public.profiles p
    where s.study_id = st.id
      and s.application_id = a.id
      and a.participant_id = p.id
      and s.reminder_sent = false
      and s.starts_at > now()
      and s.starts_at <= now() + (window_minutes || ' minutes')::interval
    returning s.id, s.starts_at, st.title, p.email, p.full_name;
end;
$$;

grant execute on function public.pop_due_session_reminders(int) to anon, authenticated;

-- Feature: post-session ratings. One row per (application, rater) — a
-- participant rates the researcher and vice versa, each exactly once.
create table public.session_ratings (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  rater_role user_role not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (application_id, rater_role)
);

alter table public.session_ratings enable row level security;

create policy "Participant can rate own completed application"
  on public.session_ratings for insert
  to authenticated
  with check (
    rater_role = 'participant'
    and exists (
      select 1 from public.applications a
      where a.id = session_ratings.application_id
        and a.participant_id = auth.uid()
        and a.status = 'completed'
    )
  );

create policy "Researcher can rate own study's completed application"
  on public.session_ratings for insert
  to authenticated
  with check (
    rater_role = 'researcher'
    and exists (
      select 1 from public.applications a
      join public.studies st on st.id = a.study_id
      where a.id = session_ratings.application_id
        and st.researcher_id = auth.uid()
        and a.status = 'completed'
    )
  );

create policy "Either side of the application can view its ratings"
  on public.session_ratings for select
  to authenticated
  using (
    exists (
      select 1 from public.applications a
      join public.studies st on st.id = a.study_id
      where a.id = session_ratings.application_id
        and (a.participant_id = auth.uid() or st.researcher_id = auth.uid())
    )
  );
