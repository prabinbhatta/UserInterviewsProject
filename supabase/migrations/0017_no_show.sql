-- Module 15: let a researcher flag a scheduled session that never
-- happened. Kept as its own terminal status distinct from 'approved' —
-- a researcher who wants to give the participant another chance already
-- has "Cancel booking" for that; this is for recording that they don't.
-- Run once in Supabase SQL Editor.

alter type application_status add value 'no_show';
