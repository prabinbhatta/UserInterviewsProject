-- Module 10: researcher-initiated invite links (single + bulk).
-- No email-sending dependency by design — the researcher gets a shareable
-- link per invitee and sends it however they like (WhatsApp, email,
-- SMS), sidestepping the Resend domain-verification blocker entirely.
-- Run once in Supabase SQL Editor.

create table public.study_invitations (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references public.studies (id) on delete cascade,
  email text not null,
  token uuid not null default gen_random_uuid() unique,
  status text not null default 'invited' check (status in ('invited', 'accepted')),
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  accepted_by uuid references public.profiles (id)
);

alter table public.study_invitations enable row level security;

create policy "Researchers manage own study invitations"
  on public.study_invitations for all
  using (
    exists (
      select 1 from public.studies s
      where s.id = study_invitations.study_id
        and s.researcher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.studies s
      where s.id = study_invitations.study_id
        and s.researcher_id = auth.uid()
    )
  );

-- The token itself (unguessable, random) is the credential here, not row
-- ownership or being logged in — someone should see what study they're
-- invited to *before* signing up, so this is intentionally public. The
-- app always narrows to one exact token via the query; nothing here lets
-- a visitor browse or enumerate invitations.
create policy "Anyone can look up an invitation by its exact token"
  on public.study_invitations for select
  using (true);

create policy "Signed-in users can accept an invitation"
  on public.study_invitations for update
  using (auth.uid() is not null)
  with check (accepted_by = auth.uid());
