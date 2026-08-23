-- Module 4: participant applications with automatic screener grading.
-- Run once in Supabase SQL Editor.

create type application_status as enum (
  'qualified',
  'rejected',
  'approved',
  'scheduled',
  'completed'
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references public.studies (id) on delete cascade,
  participant_id uuid not null references public.profiles (id) on delete cascade,
  status application_status not null,
  created_at timestamptz not null default now(),
  unique (study_id, participant_id)
);

create table public.application_answers (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  question_id uuid not null references public.screener_questions (id) on delete cascade,
  answer_text text,
  selected_option_ids uuid[] not null default '{}'
);

alter table public.applications enable row level security;
alter table public.application_answers enable row level security;

create policy "Participants manage own applications"
  on public.applications for all
  using (auth.uid() = participant_id)
  with check (auth.uid() = participant_id);

create policy "Researchers view applications to their own studies"
  on public.applications for select
  using (
    exists (
      select 1 from public.studies s
      where s.id = applications.study_id
        and s.researcher_id = auth.uid()
    )
  );

create policy "Participants manage own application answers"
  on public.application_answers for all
  using (
    exists (
      select 1 from public.applications a
      where a.id = application_answers.application_id
        and a.participant_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.applications a
      where a.id = application_answers.application_id
        and a.participant_id = auth.uid()
    )
  );

create policy "Researchers view answers to their own studies' applications"
  on public.application_answers for select
  using (
    exists (
      select 1 from public.applications a
      join public.studies s on s.id = a.study_id
      where a.id = application_answers.application_id
        and s.researcher_id = auth.uid()
    )
  );

-- Participants need to browse and apply to studies, so active studies and
-- their screeners must be readable beyond just the owning researcher.
create policy "Anyone can view active studies"
  on public.studies for select
  using (status = 'active');

create policy "Anyone can view screener questions for active studies"
  on public.screener_questions for select
  using (
    exists (
      select 1 from public.studies s
      where s.id = screener_questions.study_id
        and s.status = 'active'
    )
  );

create policy "Anyone can view screener options for active studies"
  on public.screener_options for select
  using (
    exists (
      select 1 from public.screener_questions q
      join public.studies s on s.id = q.study_id
      where q.id = screener_options.question_id
        and s.status = 'active'
    )
  );
