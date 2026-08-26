# Backlog

Running list of scoped-but-not-yet-built work, grouped by priority. Update as items are added, started, or shipped.

## P0 — Launch blockers (trust, legal, or basic function real users will hit immediately)

### ~~Resend domain verification~~ — shipped 2026-08-24
Verified `mail.research.prabinbhatta.com.np` in Resend (DKIM/SPF/DMARC
records added via Vercel DNS). This fixed two separate things: (1)
Supabase Auth's own confirmation/reset emails, which were failing
outright in production (`Error sending confirmation email`, 500) because
no custom SMTP was configured — now using Resend's SMTP relay; and (2)
the app's own in-app notification emails (`src/lib/email.ts`), which
previously only delivered to the account owner via Resend's sandbox
address `onboarding@resend.dev` — now sent from the verified domain.
Also fixed Supabase's Site URL (was still `localhost:3000`, so
confirmation links pointed at the wrong host in production). Verified
end-to-end with a real signup on a fresh email address.

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

### ~~Remaining bilingual coverage~~ — shipped 2026-08-24
Extended the existing EN/Nepali i18n system across every researcher-facing
page (dashboard, studies list, study form, screener, time slots, invite +
CSV import, applications, messages, analytics) and the rest of the
participant dashboard (applications, messages, scheduling, profile).
~190 new keys in `src/lib/i18n.ts`. Scope decision: `/admin` stays
English-only — it's a single-operator internal tool, not participant/
researcher-facing, so translating it wouldn't add real value.

### ~~VoiceWaveform hint text~~ — shipped 2026-08-24
"Hover to hear a moment from a real session." now translates via
`useLanguage()`/`t()`, matching the rest of the landing page. The
fabricated testimonial quotes themselves were deliberately left
untranslated (translating them would misrepresent authenticity).

### ~~SEO / social share metadata~~ — shipped 2026-08-24
Dynamic Open Graph image (`src/app/opengraph-image.tsx`, via `next/og`)
plus Open Graph/Twitter Card metadata in `layout.tsx`. Links shared in
WhatsApp/Facebook now show a title, description, and preview image.

### ~~Basic privacy-friendly analytics~~ — shipped 2026-08-24
Self-hosted `analytics_events` table (event type, optional path, timestamp
— no cookies, no IP, no user identifier). `PageviewTracker` logs one event
per route change from the root layout; signup completion, application
submission, and session completion are logged from their existing server
actions. Surfaced on `/admin` as a 30-day pageview/path breakdown and a
signup → application → completion funnel. See
`0025_analytics_events.sql`, `src/lib/logEvent.ts`.

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

### ~~Auto-generated video meeting links~~ — shipped 2026-08-24
Google Meet via the dedicated Meet API (not the Calendar API — the
Calendar API's auto-generated conference data always defaults to
knock-to-join/host-must-admit for a personal Google account, and that
setting isn't exposed through it at all), using the founder's own Google
account, no company registration needed. `src/lib/googleMeet.ts` creates
a Meet "space" directly with `accessType: OPEN` so anyone with the link
joins immediately — talks to Google's token + Meet endpoints directly via
fetch, no new npm dependency. "Auto-generate a Google Meet link" checkbox
only appears on the slot form for online-format studies; the server
action re-verifies the study's actual format itself rather than trusting
the client. Falls back to the manual location field if generation fails
for any reason. Verified end-to-end: got back a real meet.google.com
link for an online study with the OPEN-access payload confirmed;
confirmed the option is entirely absent for in-person studies.

### ~~Interactive design pass~~ — shipped 2026-08-24
First pass covered loading states and empty-state illustrations for both
dashboards and both studies/applications lists. Second pass extended
`loading.tsx` to every remaining route that does server-side data
fetching: 3 routes with no ancestor Suspense boundary at all (settings,
report, invite/[token]), plus page-specific skeletons for 6 nested
dynamic routes (study detail, schedule, both message threads, applicants
list, analytics) that were previously inheriting a mismatched skeleton
from their parent list page. Left `MessageThread`'s inline "no messages
yet" text as plain text (scope decision) — it sits directly above an
active chat input, where a large empty-state illustration would feel out
of place rather than helpful. Admin's report/incentive queues need no
empty state since they're conditionally hidden entirely when empty. Pure
client-side forms (login, signup, forgot/reset password) don't block on
server data fetching, so they don't need a loading.tsx.

Third pass covered the landing page, which the first two passes hadn't
touched. New `PlatformFlow` component: a 3-node illustration (company
posts a study → platform matches & screens → participant shares their
voice) placed right after the hero, so a first-time visitor understands
the marketplace mechanic before reading anything else — reuses the
existing brand palette and the site logo's abstract-bars motif rather
than a mismatched illustration style, and stacks vertically with
connectors hidden on mobile. Also replaced the "trust" section's three
empty circle placeholders with real icons (checkmark, calendar, payment
shield) matching what each one describes. Both bilingual, verified at
desktop and mobile widths in both languages.

### ~~Participant referral program~~ — shipped 2026-08-24
A participant's own user id doubles as their referral code — no separate
code column. Signup accepts `?ref=<user-id>`, validated server-side in
`handle_new_user()` (malformed/nonexistent referrer ids are silently
dropped rather than blocking signup). Referral count read via a
`SECURITY DEFINER` function since profiles RLS only allows viewing your
own row. Surfaced on the participant dashboard with a copyable invite
link and live count. Verified end-to-end: a real signup via a referral
link incremented the referrer's count. See `0027_referrals.sql`.

### ~~Loading states & empty-state illustrations (first pass)~~ — shipped 2026-08-24
New `Skeleton`/`SkeletonList` primitives + `loading.tsx` for the six
highest-traffic routes (both dashboards, both studies lists, both
applications lists). New `EmptyState` component (on-brand inline SVG
illustration, title, body, optional CTA) replacing plain-text empty
states on browse studies, participant applications, researcher studies,
researcher applicants, and open time slots. See "Finish the interactive
design pass" above for remaining scope.

### ~~Basic signup rate limiting~~ — shipped 2026-08-24
Per-IP rate limiting on signup (5/15min) and login (10/15min), enforced by
a `SECURITY DEFINER` Postgres function with no direct table access from
the app roles. Required moving signup/login off direct client-side
Supabase calls onto server actions, since only the server can see the
request IP. See `0026_auth_rate_limiting.sql`, `src/lib/rateLimit.ts`,
`src/app/login/actions.ts`, `src/app/signup/actions.ts`.

### ~~Calendar export (.ics) for booked sessions~~ — shipped 2026-08-24
`GET /calendar/[slotId]` returns a valid .ics file for a booked session,
with an authorization check beyond RLS (only the booked participant or
the study's researcher can fetch it). "Add to calendar" added to both the
participant schedule page and the researcher slots page. No OAuth or
external API — works with any calendar app. See
`src/app/calendar/[slotId]/route.ts`.

### ~~Participant search for researchers~~ — shipped 2026-08-24
New `/researcher/participants` page: filter the participant pool by
district, age range, device, and language, then invite matches directly.
Reuses the existing invite/accept plumbing (no new email code needed).
The search function returns only what's needed to decide who to invite —
never email, which stays server-side behind a separate function gated to
callers who are themselves a researcher. See
`0028_calendar_search_waitlist.sql`, `src/app/researcher/participants/`.

### ~~Waitlist for full studies~~ — shipped 2026-08-24
Participants can join a waitlist on a full study. When a spot frees up
(withdrawal, no-show, cancellation), the study auto-reopens and
waitlisted participants get a best-effort "a spot opened up" email — the
underlying Postgres function only returns waitlist data on a genuine
closed→active transition it just performed, so it can't be used to
harvest waitlisted emails on demand. See `src/lib/closeStudyIfFull.ts`.

Also fixed a real regression while building this batch: migration 0027's
`handle_new_user()` rewrite had accidentally dropped the `email` column
insert that 0013 added, so every signup since then had a NULL
`profiles.email`. Restored and backfilled in `0028_calendar_search_waitlist.sql`.

### ~~Public study browse page~~ — shipped 2026-08-24
`/browse` and `/browse/[id]` list active studies with no login required —
the existing RLS policy on `studies` already allowed anonymous reads, so
this only adds pages, not new data access. Each study gets its own SEO
metadata (title, description, Open Graph, Twitter Card); both pages end
in a "sign up to apply" CTA rather than exposing the real screener, which
stays behind login on `/participant/studies`. Verified logged out in the
browser, including a 404 for a nonexistent/inactive study id.

### ~~Timezone-aware scheduling~~ — shipped 2026-08-24
Two bugs, one root cause: a `datetime-local` input carries no timezone,
and Server Components render on the server, so any time shown or parsed
there used the server's own timezone rather than the researcher's or
participant's. Fixed the write path by converting the picked date/time
to a full ISO string client-side before it reaches the server, and the
read path with a new `LocalDateTime` client component. Found and fixed a
second, more subtle bug while verifying: the first draft's
`suppressHydrationWarning` span never actually got patched to the real
client value, so every time rendered permanently blank — fixed with
`useSyncExternalStore`, which correctly forces the client-only render.
Verified live: a slot entered as 10:00 AM round-tripped back as exactly
10:00 AM with no drift, matching on both the researcher and participant
side. See `src/components/ui/LocalDateTime.tsx`.

### ~~Session reminder emails~~ — shipped 2026-08-24
`GET /api/cron/session-reminders` runs every 15 minutes via Vercel Cron
(`vercel.json`), gated by a `CRON_SECRET` bearer token. Calls a new
`SECURITY DEFINER` function, `pop_due_session_reminders(window_minutes)`,
which only returns a due slot's data as a side effect of atomically
flipping its own new `reminder_sent` flag in the same query — so it
can't be called directly via the anon key to harvest participant emails,
and can't double-send. Verified live: booked a real slot 20 minutes out,
confirmed the RPC returns exactly that slot and is idempotent on a
second call, and confirmed the cron route's auth gate (401/200) and
response shape. See `0029_session_reminders_and_ratings.sql`,
`src/app/api/cron/session-reminders/route.ts`.

Requires `CRON_SECRET` to be set in Vercel's production environment
variables (same value as `.env.local`) for the deployed cron job to
authenticate — confirm this is set if reminders don't appear to be
sending in production.

### ~~Post-session ratings~~ — shipped 2026-08-24
5-star rating form on the completed-status section of both the
participant's applications page and the researcher's applicants page, so
either side can rate the other after a session. `session_ratings` table +
RLS shipped earlier with the session reminders migration; this adds the
UI (`StarRatingInput`/`StarRatingDisplay`) and the two server actions.
RLS enforces which `rater_role` each side may insert as, independent of
what the client sends. Verified live: a 4-star participant rating and a
5-star researcher rating on real completed applications both persisted
correctly with no duplicate rows, confirmed directly via the table.

### ~~Button/card depth pass + loading state gaps~~ — shipped 2026-08-26
The shared Button and Card components had zero shadow or press feedback
anywhere, which read as flat/non-interactive across the whole platform.
Added a resting shadow, deeper hover shadow with lift, and a real
active/press state (scale down, shadow flattens) to both. Found two real
bugs auditing the landing page: the hero's primary CTAs and the two
feature-card CTAs were bespoke one-off elements that never went through
the shared button system (`box-shadow: none`) — fixed by routing the
hero CTAs through the shared `LinkButton` and hand-matching depth onto
the two card CTAs' one-off colors. Also, the voice-waveform's resting
bars used `--mist` on a near-white card — technically rendered but too
low-contrast to see; switched to `indigo/35`. Filled `loading.tsx` for
the 8 routes that run a real Supabase query but had none (`/browse`,
`/browse/[id]`, participant profile, researcher participant search, and
four `researcher/studies/[id]/*` sub-pages); skipped instant-rendering
form pages where a skeleton would just flash uselessly.
