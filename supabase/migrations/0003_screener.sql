-- Module 3: screener questions with per-option accept/reject logic.
-- Run once in Supabase SQL Editor.

create type screener_question_type as enum (
  'pick_one',
  'pick_any',
  'short_answer',
  'long_answer'
);
create type screener_decision as enum ('accept', 'reject');

create table public.screener_questions (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references public.studies (id) on delete cascade,
  question_text text not null,
  type screener_question_type not null,
  required boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.screener_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.screener_questions (id) on delete cascade,
  label text not null,
  decision screener_decision not null,
  sort_order int not null default 0
);

alter table public.screener_questions enable row level security;
alter table public.screener_options enable row level security;

-- Ownership is checked by joining up to studies.researcher_id since neither
-- table stores the researcher directly.
create policy "Researchers manage own screener questions"
  on public.screener_questions for all
  using (
    exists (
      select 1 from public.studies s
      where s.id = screener_questions.study_id
        and s.researcher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.studies s
      where s.id = screener_questions.study_id
        and s.researcher_id = auth.uid()
    )
  );

create policy "Researchers manage own screener options"
  on public.screener_options for all
  using (
    exists (
      select 1 from public.screener_questions q
      join public.studies s on s.id = q.study_id
      where q.id = screener_options.question_id
        and s.researcher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.screener_questions q
      join public.studies s on s.id = q.study_id
      where q.id = screener_options.question_id
        and s.researcher_id = auth.uid()
    )
  );
