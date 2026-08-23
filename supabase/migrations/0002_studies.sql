-- Module 2: studies created by researchers.
-- Run once in Supabase SQL Editor.

create type study_format as enum ('online', 'in_person', 'phone');
create type study_status as enum ('draft', 'active', 'closed');

create table public.studies (
  id uuid primary key default gen_random_uuid(),
  researcher_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null default '',
  format study_format not null default 'online',
  session_length_minutes int not null default 30,
  participants_needed int not null default 1,
  incentive_amount numeric(10, 2) not null default 0,
  status study_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.studies enable row level security;

create policy "Researchers manage own studies"
  on public.studies for all
  using (auth.uid() = researcher_id)
  with check (auth.uid() = researcher_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger studies_set_updated_at
  before update on public.studies
  for each row execute procedure public.set_updated_at();
