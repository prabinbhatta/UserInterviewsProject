-- Minimal, privacy-friendly analytics: no cookies, no IP storage, no
-- cross-site tracking. Just an event type, an optional path, and a
-- timestamp — enough for pageview counts and a signup -> application ->
-- completion funnel, nothing that identifies a person.
create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  path text,
  created_at timestamptz not null default now()
);

create index analytics_events_event_type_created_at_idx
  on analytics_events (event_type, created_at);

alter table analytics_events enable row level security;

-- Pageviews fire before login, so anyone (anon or authenticated) can log
-- an event. There is nothing to protect here since rows carry no user
-- identifier.
create policy "Anyone can log an analytics event"
  on analytics_events for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read analytics events"
  on analytics_events for select
  to authenticated
  using (is_admin());
