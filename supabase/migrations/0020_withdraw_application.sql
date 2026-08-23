-- Module 18: let a participant withdraw an application they no longer
-- want to pursue, instead of leaving it stuck at 'qualified'/'approved'
-- forever with no way back except a researcher's own action.
-- Run once in Supabase SQL Editor.

alter type application_status add value 'withdrawn';
