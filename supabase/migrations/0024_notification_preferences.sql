-- Module 21: per-type email notification opt-out. Default true (opt-out
-- model) so existing behavior is unchanged until someone turns one off.
-- Run once in Supabase SQL Editor.

alter table public.profiles
  add column notify_approved boolean not null default true,
  add column notify_scheduled boolean not null default true,
  add column notify_messages boolean not null default true,
  add column notify_incentives boolean not null default true;
