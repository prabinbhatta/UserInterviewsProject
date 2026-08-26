-- The waitlist feature (0028) lets a participant view a closed study and
-- join its waitlist, but RLS on `studies` only ever exposed a closed
-- study to someone who ALREADY has an application on it (0014) — anyone
-- else got a 404, since "Anyone can view active studies" (0004) requires
-- status = 'active'. There was never a policy covering "no application
-- yet, but the study is closed" — the exact case the waitlist join UI is
-- for. Extending visibility to closed studies too; draft stays hidden.
drop policy "Anyone can view active studies" on public.studies;

create policy "Anyone can view active or closed studies"
  on public.studies for select
  using (status in ('active', 'closed'));
