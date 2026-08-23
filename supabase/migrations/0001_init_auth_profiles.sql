-- Module 1: accounts, roles, and profile tables.
-- Run once in Supabase SQL Editor (or via `supabase db push` once the CLI is linked).

create type user_role as enum ('researcher', 'participant');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create table public.researcher_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  company_name text,
  industry text
);

alter table public.researcher_profiles enable row level security;

create policy "Researchers manage own researcher profile"
  on public.researcher_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.participant_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  district text,
  age int,
  occupation text,
  income_band text,
  languages text[] not null default '{}',
  devices text[] not null default '{}'
);

alter table public.participant_profiles enable row level security;

create policy "Participants manage own participant profile"
  on public.participant_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-creates a profiles row right after signup, reading the role and name
-- out of the auth metadata the client passes in supabase.auth.signUp().
-- security definer is required because a brand-new user has no RLS grants
-- yet at the moment this trigger fires.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    (new.raw_user_meta_data ->> 'role')::user_role,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
