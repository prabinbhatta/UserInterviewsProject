-- Module 9: platform operator (admin) dashboard.
-- is_admin is a separate flag rather than a third `role` value, since the
-- founder is also a researcher and shouldn't lose that dashboard by
-- becoming an admin.
-- Run once in Supabase SQL Editor.

alter table public.profiles add column is_admin boolean not null default false;

create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

create policy "Admins view all studies"
  on public.studies for select
  using (public.is_admin());

create policy "Admins view all applications"
  on public.applications for select
  using (public.is_admin());

create policy "Admins view all incentive records"
  on public.incentive_records for select
  using (public.is_admin());

create policy "Admins update incentive records"
  on public.incentive_records for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins view all profiles"
  on public.profiles for select
  using (public.is_admin());
