# Backlog

Running list of scoped-but-not-yet-built work, grouped by priority. Update as items are added, started, or shipped.

## P0 — Launch blockers (trust, legal, or basic function real users will hit immediately)

### Resend domain verification
Blocks transactional email to anyone other than the account owner until a
custom sending domain is verified. Single biggest blocker for real launch —
confirmation emails, notifications, everything depend on it.

### ~~Password reset / forgot password~~ — shipped 2026-08-23
`/forgot-password` and `/reset-password` pages using Supabase Auth's
recovery flow. Along the way, found and fixed a real bug via live
testing: Supabase's default email template drops the recovery type by
the time it reaches `/auth/callback` as a bare `?code=...`, so it's now
carried through via the `redirectTo` URL. Verified end-to-end with a
real reset email.

### ~~Terms of Service & Privacy Policy pages~~ — shipped 2026-08-23
`/terms` and `/privacy`, covering what the platform does, off-platform
incentive payments, what data is collected and who can see it, and
support contact. Linked from the landing page footer and signup
(bilingual).

### ~~User-friendly error messages everywhere~~ — shipped 2026-08-23
`src/lib/friendlyError.ts` maps raw Postgres/PostgREST/Supabase Auth
errors (known messages, Postgres error codes, HTTP status like 429 for
rate limits) to plain-language copy, with a generic fallback. Applied
across every server action and auth call that previously surfaced
`error.message` directly.

### ~~DNS propagation~~ — resolved 2026-08-23
`prabinbhatta.com.np` nameservers now point to Vercel; both the apex and
`www` resolve and serve the platform (confirmed via public resolvers and
a direct HTTPS request). The domain now serves this app directly rather
than the founder's portfolio site, which needs a new home if it's coming
back online elsewhere. Follow-up: confirm `NEXT_PUBLIC_SITE_URL` in Vercel
env vars is set to `https://prabinbhatta.com.np` so notification email
links point at the real domain.

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

### ~~Search & filter on browse studies~~ — shipped 2026-08-23
Filters for format, incentive range, session length, and (for in-person)
district, via a GET-based form on `/participant/studies`. Added a
`district` column to `studies`. See `0022_study_district_search.sql`.

### ~~Bulk invite import via CSV~~ — shipped 2026-08-23
`CsvInviteForm` parses and previews a file client-side (valid/invalid/
duplicate rows) before importing. Downloadable sample template at
`/invite-template.csv`. Added `full_name` to `study_invitations`. Scope
note: `.xlsx` support was dropped in favor of CSV-only, to avoid adding
an unverified parsing dependency mid-session — worth reconsidering if
researchers actually need Excel specifically. See
`0023_invite_full_name.sql`, `src/lib/csv.ts`.

### ~~Researcher analytics~~ — shipped 2026-08-23
New `/researcher/studies/[id]/analytics`: applicant funnel, a not-a-match
rate (explicitly labeled as covering both automatic screener
disqualification and manual rejection, since both share the `rejected`
status — the schema can't currently distinguish them), and average
confirmed-received incentive.

### ~~Export applicants to CSV~~ — shipped 2026-08-23
`GET .../applications/export` streams a CSV of name, email, status,
applied-at, and incentive status/amount.

### ~~Study templates / duplicate a study~~ — shipped 2026-08-23
`duplicateStudy` copies a study's fields plus its screener questions and
options into a new draft, then redirects to its edit page.

### ~~Participant earnings summary~~ — shipped 2026-08-23
Participant dashboard shows a running total of received incentives.

### ~~Notification preferences~~ — shipped 2026-08-23
New `/settings` page (shared across roles) with per-type email opt-out
(approved, scheduled, messages, incentives), backed by four boolean
columns on `profiles` (default true). See `0024_notification_preferences.sql`.

## P3 — Polish

### Remaining bilingual coverage
Landing page, signup, and the participant browse/study-detail/apply flow
are translated. Researcher-side pages, the rest of the participant
dashboard (applications, messages, scheduling, incentives), and admin are
still English-only.

### ~~VoiceWaveform hint text~~ — shipped 2026-08-24
"Hover to hear a moment from a real session." now translates via
`useLanguage()`/`t()`, matching the rest of the landing page. The
fabricated testimonial quotes themselves were deliberately left
untranslated (translating them would misrepresent authenticity).

### ~~SEO / social share metadata~~ — shipped 2026-08-24
Dynamic Open Graph image (`src/app/opengraph-image.tsx`, via `next/og`)
plus Open Graph/Twitter Card metadata in `layout.tsx`. Links shared in
WhatsApp/Facebook now show a title, description, and preview image.

### Basic privacy-friendly analytics
No pageview/funnel tracking at all — founder has no visibility into
signup → application → completion conversion without querying the database
directly.

### ~~Accessibility pass~~ — shipped 2026-08-24
Computed WCAG 2.1 contrast ratios for the app's muted-text convention and
found `text-ink/40` and `/50` both failed AA (2.51:1 and 3.34:1 vs the
4.5:1 minimum) — bumped app-wide to `/60`/`/70` (46 occurrences across
~28 files, including the shared `mutedLinkClasses` and Button `ghost`
variant). Added a visible focus ring to `fieldClasses` for keyboard
navigation. Audited for missing `alt`/`aria-label`: no raw `<img>` tags
in the app, and the one icon-only SVG (site logo) is correctly
`aria-hidden` next to visible text; existing icon buttons already had
`aria-label`s.

### Final product name
Deferred by founder; current working name is "Research Platform."

### Basic signup rate limiting
No rate limiting on signup/login attempts — low risk at current scale but
worth adding before wider launch to blunt basic abuse/enumeration attempts.
