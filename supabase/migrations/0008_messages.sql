-- Module 7: per-application messaging between researcher and participant.
-- Run once in Supabase SQL Editor.

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Participants message on own applications"
  on public.messages for all
  using (
    exists (
      select 1 from public.applications a
      where a.id = messages.application_id
        and a.participant_id = auth.uid()
    )
  )
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.applications a
      where a.id = messages.application_id
        and a.participant_id = auth.uid()
    )
  );

create policy "Researchers message on applications to their studies"
  on public.messages for all
  using (
    exists (
      select 1 from public.applications a
      join public.studies s on s.id = a.study_id
      where a.id = messages.application_id
        and s.researcher_id = auth.uid()
    )
  )
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.applications a
      join public.studies s on s.id = a.study_id
      where a.id = messages.application_id
        and s.researcher_id = auth.uid()
    )
  );
