-- Module 17: let a researcher or participant report abusive behavior in
-- a message thread, or a participant report a study they suspect is
-- spam/scam. Surfaced to the admin dashboard's existing review-and-
-- resolve pattern (same shape as the incentive-dispute queue).
-- Run once in Supabase SQL Editor.

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reported_user_id uuid references public.profiles (id) on delete set null,
  study_id uuid references public.studies (id) on delete set null,
  application_id uuid references public.applications (id) on delete set null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.reports enable row level security;

create policy "Users file their own reports"
  on public.reports for insert
  with check (reporter_id = auth.uid());

create policy "Users view their own reports"
  on public.reports for select
  using (reporter_id = auth.uid());

create policy "Admins view all reports"
  on public.reports for select
  using (public.is_admin());

create policy "Admins resolve reports"
  on public.reports for update
  using (public.is_admin())
  with check (public.is_admin());
