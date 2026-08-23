-- Module 8: incentive tracking with two-sided confirmation.
-- Money moves directly between researcher and participant, off-platform —
-- this table only tracks the status both sides report.
-- Run once in Supabase SQL Editor.

create type incentive_status as enum ('pending', 'sent', 'received', 'not_received');

create table public.incentive_records (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications (id) on delete cascade,
  amount numeric(10, 2) not null,
  status incentive_status not null default 'pending',
  sent_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.incentive_records enable row level security;

create policy "Researchers manage incentive records for their studies"
  on public.incentive_records for all
  using (
    exists (
      select 1 from public.applications a
      join public.studies s on s.id = a.study_id
      where a.id = incentive_records.application_id
        and s.researcher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.applications a
      join public.studies s on s.id = a.study_id
      where a.id = incentive_records.application_id
        and s.researcher_id = auth.uid()
    )
  );

create policy "Participants view and respond to their own incentive record"
  on public.incentive_records for all
  using (
    exists (
      select 1 from public.applications a
      where a.id = incentive_records.application_id
        and a.participant_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.applications a
      where a.id = incentive_records.application_id
        and a.participant_id = auth.uid()
    )
  );
