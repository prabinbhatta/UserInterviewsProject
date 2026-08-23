-- Module 16: let a researcher attach where a session happens to a time
-- slot — a meeting link for online studies, a physical address for
-- in-person ones, or call details for phone ones. Optional, so existing
-- slots without one still work.
-- Run once in Supabase SQL Editor.

alter table public.study_slots add column location text;
