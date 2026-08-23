-- Module 19: district on studies (for in-person studies), enabling
-- participant-side search/filter on the browse studies page.
-- Run once in Supabase SQL Editor.

alter table public.studies add column district text;
