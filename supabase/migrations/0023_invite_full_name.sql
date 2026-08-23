-- Module 20: optional full_name on study_invitations, for bulk CSV
-- import (email required, full_name optional).
-- Run once in Supabase SQL Editor.

alter table public.study_invitations add column full_name text;
