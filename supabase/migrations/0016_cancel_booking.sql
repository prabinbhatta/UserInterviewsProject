-- Module 14: let a participant cancel their own booked session. A
-- researcher cancelling a booking on their own study's slots already
-- works via the existing "Researchers manage own study slots" (for all)
-- policy — only the participant side needs a new policy, since
-- "Approved participants claim an open slot" only allows the null ->
-- booked direction, not releasing a slot they already hold.
-- Run once in Supabase SQL Editor.

create policy "Participants can release their own booked slot"
  on public.study_slots for update
  using (
    exists (
      select 1 from public.applications a
      where a.id = study_slots.application_id
        and a.participant_id = auth.uid()
    )
  )
  with check (application_id is null);
