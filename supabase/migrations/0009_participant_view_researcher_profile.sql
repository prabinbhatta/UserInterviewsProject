-- Fix: participants could see their own applications but had no RLS
-- permission to read the researcher's profile (full_name), so the
-- researcher's name silently failed to load on the participant's message
-- thread and fell back to "the researcher". This mirrors the reverse
-- policy already in place (researchers viewing their applicants' profiles).

create policy "Participants view researcher profiles for studies they applied to"
  on public.profiles for select
  using (
    exists (
      select 1 from public.applications a
      join public.studies s on s.id = a.study_id
      where s.researcher_id = profiles.id
        and a.participant_id = auth.uid()
    )
  );
