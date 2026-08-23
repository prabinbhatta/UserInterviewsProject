# Backlog

Running list of scoped-but-not-yet-built work, grouped by priority. Update as items are added, started, or shipped.

## P0 — Launch blockers (trust, legal, or basic function real users will hit immediately)

### Resend domain verification
Blocks transactional email to anyone other than the account owner until a
custom sending domain is verified. Single biggest blocker for real launch —
confirmation emails, notifications, everything depend on it.

### Password reset / forgot password
No "forgot password" flow exists anywhere in the app today. Any real user
who mistypes or forgets their password is permanently locked out with no
recovery path. Needs a `/forgot-password` page (email a reset link via
Supabase Auth's built-in reset flow) and a `/reset-password` page to set the
new one.

### Terms of Service & Privacy Policy pages
No legal pages exist. The app collects real PII (age, income band, district,
phone-adjacent info via profiles) and handles money coordination between
strangers — needs baseline ToS + Privacy Policy pages linked from
signup/footer before onboarding real users, even in MVP form.

### User-friendly error messages everywhere
Several server actions currently throw or return the raw Postgres/Supabase
error string straight to the UI (e.g. `throw new Error(error.message)` in
`incentive-actions.ts`, `{ error: error.message }` in `messages-actions.ts`
and most form actions). Needs a small mapping layer — a function that takes
a Postgres/Supabase error (or known error codes: unique violation, RLS
denial, not-found, etc.) and returns a plain-language message — applied
consistently across every server action and form, plus fallback copy
("Something went wrong — try again") so nothing ever surfaces a raw stack
trace or SQL error to a user.

### DNS propagation
`prabinbhatta.com.np` → Vercel nameservers — in progress, ETA 1-2 days from
2026-08-23. Nothing to build; just tracking until it resolves.

## P1 — Core marketplace-loop gaps (things that break trust once real people use it)

### ~~Study capacity enforcement~~ — shipped 2026-08-23
A study now auto-closes once approved-application count reaches
`participants_needed`, checked from both the screener-approval path and
invite-based auto-join. See `src/lib/closeStudyIfFull.ts`, migrations
`0014_study_capacity.sql` / `0015_fix_study_visibility_recursion.sql`.

### ~~Cancel / reschedule a booked time slot~~ — shipped 2026-08-23
Either side can now cancel a scheduled session — the slot reopens and the
application reverts to `approved`, with a best-effort email to the other
party. See `src/lib/cancelBooking.ts`, migration `0016_cancel_booking.sql`.

### ~~No-show / session-didn't-happen handling~~ — shipped 2026-08-23
A researcher can flag a scheduled session that never happened via "Didn't
show up," a new terminal `no_show` application status. Frees the slot for
reuse but creates no incentive record. See `0017_no_show.sql`.

### ~~Withdraw an application~~ — shipped 2026-08-23
A participant can withdraw a `qualified` or `approved` application via a
new `withdrawn` status. Withdrawing an approved application reopens its
study if that frees a spot under `participants_needed`. See
`0020_withdraw_application.sql`.

**Bonus fix while testing this**: `closeStudyIfFull`/
`reopenStudyIfUnderCapacity` silently no-op'd when called from a
participant-initiated action (only researchers had RLS UPDATE rights on
`studies`) — this affected the invite-accept auto-close path too, not
just withdrawal. Fixed with `SECURITY DEFINER` Postgres functions. See
`0021_fix_capacity_rls_gap.sql`.

### ~~Report / block abusive user or spam study~~ — shipped 2026-08-23
A "Report" link on both message threads and a study's detail page files
into a new `reports` table, auto-resolving the reported user/study from
context. Surfaced on `/admin` as an "Open reports" queue with a resolve
action. See `0019_reports.sql`, `src/app/report-actions.ts`.

### ~~Location / meeting link on time slots~~ — shipped 2026-08-23
Researchers can attach a meeting link, address, or call details to a time
slot, labeled by the study's format. Shown to participants on the
schedule page and included in the slot-booked email. See
`0018_slot_location.sql`.

## P2 — Growth & usability enhancements

### Search & filter on browse studies
`/participant/studies` currently lists every active study with no
filtering. Once there are more than a couple of open studies at once, needs
filters for format, incentive range, session length, and (for in-person)
district.

### Bulk invite import via CSV/Excel upload
Extends the existing researcher invite feature
(`src/app/researcher/studies/[id]/invite/`), which today only accepts
emails pasted into a textarea (`InviteForm.tsx`). Add a downloadable sample
template (CSV with `email` required, `full_name` optional), file upload
(`.csv`/`.xlsx`), validation with a preview/confirmation step before
importing, and a `full_name` column on `study_invitations` (migration
needed) to store it.

### Researcher analytics
No stats surface for a researcher beyond raw application lists — applicant
funnel (applied → qualified → approved → scheduled → completed),
disqualification rate from the screener, and average incentive paid would
help researchers see whether a study is working.

### Export applicants to CSV
Researchers currently can only view applicants in the review-queue UI —
no way to export the list (e.g. for offline recruiting records or
compliance).

### Study templates / duplicate a study
No way to reuse a screener or study setup — every new study starts from
scratch. A "duplicate this study" action (copies title/format/screener
questions as a new draft) would speed up repeat researchers.

### Participant earnings summary
No running total of incentives received shown to a participant — would sit
naturally on the participant dashboard alongside profile completeness.

### Notification preferences
All email notification types (approved, scheduled, new message, incentive
sent) are all-or-nothing today — no per-type opt-out.

## P3 — Polish

### Remaining bilingual coverage
Landing page, signup, and the participant browse/study-detail/apply flow
are translated. Researcher-side pages, the rest of the participant
dashboard (applications, messages, scheduling, incentives), and admin are
still English-only.

### VoiceWaveform hint text
("Hover to hear a moment from a real session.") on the landing page is
still English-only.

### SEO / social share metadata
No Open Graph / Twitter Card metadata on the landing page — links shared in
WhatsApp/Facebook (likely primary sharing channels in Nepal) currently show
no preview image or description.

### Basic privacy-friendly analytics
No pageview/funnel tracking at all — founder has no visibility into
signup → application → completion conversion without querying the database
directly.

### Accessibility pass
No dedicated a11y audit done yet — alt text, aria labels, color contrast,
and keyboard navigation haven't been systematically checked.

### Final product name
Deferred by founder; current working name is "Research Platform."

### Basic signup rate limiting
No rate limiting on signup/login attempts — low risk at current scale but
worth adding before wider launch to blunt basic abuse/enumeration attempts.
