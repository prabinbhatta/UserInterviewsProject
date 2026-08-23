-- Module 6a: lets researchers approve/reject applications to their own studies.
-- Run once in Supabase SQL Editor.

create policy "Researchers update applications to their own studies"
  on public.applications for update
  using (
    exists (
      select 1 from public.studies s
      where s.id = applications.study_id
        and s.researcher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.studies s
      where s.id = applications.study_id
        and s.researcher_id = auth.uid()
    )
  );

-- Researchers reviewing applicants need to see their participant profile
-- (district, occupation, etc.), not just their auth email.
create policy "Researchers view participant profiles for their applicants"
  on public.participant_profiles for select
  using (
    exists (
      select 1 from public.applications a
      join public.studies s on s.id = a.study_id
      where a.participant_id = participant_profiles.user_id
        and s.researcher_id = auth.uid()
    )
  );

create policy "Researchers view profiles of their applicants"
  on public.profiles for select
  using (
    exists (
      select 1 from public.applications a
      join public.studies s on s.id = a.study_id
      where a.participant_id = profiles.id
        and s.researcher_id = auth.uid()
    )
  );
