-- Basic per-IP rate limiting for signup/login, to blunt brute-force and
-- enumeration attempts. The table has no RLS policies at all — only the
-- SECURITY DEFINER function below can read or write it, so it isn't
-- reachable directly from the anon/authenticated roles the app uses.
create table auth_rate_limits (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index auth_rate_limits_identifier_action_created_at_idx
  on auth_rate_limits (identifier, action, created_at);

alter table auth_rate_limits enable row level security;

-- Atomically checks the attempt count for (identifier, action) within the
-- trailing window and logs a new attempt if under the limit. Returns
-- false (blocked) without logging anything once the limit is hit, so a
-- client hammering this doesn't inflate its own window further.
create or replace function check_auth_rate_limit(
  p_identifier text,
  p_action text,
  p_max_attempts int,
  p_window_minutes int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  attempt_count int;
begin
  select count(*) into attempt_count
  from auth_rate_limits
  where identifier = p_identifier
    and action = p_action
    and created_at > now() - (p_window_minutes || ' minutes')::interval;

  if attempt_count >= p_max_attempts then
    return false;
  end if;

  insert into auth_rate_limits (identifier, action) values (p_identifier, p_action);
  return true;
end;
$$;

grant execute on function check_auth_rate_limit(text, text, int, int) to anon, authenticated;
