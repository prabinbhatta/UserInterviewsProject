-- Module 13: enforce studies.participants_needed by auto-closing a study
-- once enough applications are approved. Run once in Supabase SQL Editor.

-- Once a study auto-closes it no longer matches "Anyone can view active
-- studies", which would otherwise cut off participants already in its
-- pipeline from their own messages/scheduling/incentive pages (all of
-- which join studies for its title). Let them keep seeing it.
create policy "Participants can view studies they've applied to"
  on public.studies for select
  using (
    exists (
      select 1 from public.applications a
      where a.study_id = studies.id and a.participant_id = auth.uid()
    )
  );

-- Same problem for someone opening an invite link after the study filled
-- up in the meantime — the invite itself is already publicly readable by
-- exact token, so exposing the study it points to is no new exposure.
create policy "Anyone can view studies referenced by an invitation"
  on public.studies for select
  using (
    exists (
      select 1 from public.study_invitations si
      where si.study_id = studies.id
    )
  );
