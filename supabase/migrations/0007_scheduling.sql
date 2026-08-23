-- Module 6b: researcher-posted time slots, participant self-booking.
-- Run once in Supabase SQL Editor.

create table public.study_slots (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references public.studies (id) on delete cascade,
  starts_at timestamptz not null,
  application_id uuid references public.applications (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.study_slots enable row level security;

create policy "Researchers manage own study slots"
  on public.study_slots for all
  using (
    exists (
      select 1 from public.studies s
      where s.id = study_slots.study_id and s.researcher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.studies s
      where s.id = study_slots.study_id and s.researcher_id = auth.uid()
    )
  );

create policy "Approved participants view slots for their study"
  on public.study_slots for select
  using (
    exists (
      select 1 from public.applications a
      where a.study_id = study_slots.study_id
        and a.participant_id = auth.uid()
        and a.status in ('approved', 'scheduled')
    )
  );

create policy "Approved participants claim an open slot"
  on public.study_slots for update
  using (
    application_id is null
    and exists (
      select 1 from public.applications a
      where a.study_id = study_slots.study_id
        and a.participant_id = auth.uid()
        and a.status = 'approved'
    )
  )
  with check (
    exists (
      select 1 from public.applications a
      where a.id = study_slots.application_id
        and a.participant_id = auth.uid()
    )
  );
