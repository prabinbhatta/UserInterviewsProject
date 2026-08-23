# Backlog

Running list of scoped-but-not-yet-built work. Update as items are added, started, or shipped.

## Requested 2026-08-23

### 1. User-friendly error messages everywhere
Several server actions currently throw or return the raw Postgres/Supabase
error string straight to the UI (e.g. `throw new Error(error.message)` in
`incentive-actions.ts`, `{ error: error.message }` in `messages-actions.ts`
and most form actions). Needs a small mapping layer — a function that takes
a Postgres/Supabase error (or known error codes: unique violation, RLS
denial, not-found, etc.) and returns a plain-language message — applied
consistently across every server action and form. Should also cover
network/unexpected-failure fallback copy ("Something went wrong — try
again") so nothing ever surfaces a raw stack trace or SQL error to a user.

### 2. Bulk invite import via CSV/Excel upload
Extends the existing researcher invite feature
(`src/app/researcher/studies/[id]/invite/`), which today only accepts
emails pasted into a textarea (`InviteForm.tsx`). Add:
- A downloadable sample template (CSV with `email` (required) and
  `full_name` (optional) columns) shown before upload.
- A file upload control accepting `.csv` and `.xlsx`.
- Client- or server-side parsing (CSV is trivial; `.xlsx` needs a parser
  library, e.g. `xlsx`/`exceljs` — pick one and check bundle size impact).
- Validation before import: required email column present, valid email
  format per row, dedupe against existing invitations for the study, and a
  preview/confirmation step showing row count + any skipped/invalid rows
  before committing.
- `full_name` isn't currently stored on `study_invitations` — needs a
  migration to add an optional `full_name` column if we want to prefill it
  at signup/acceptance time.

### 3. Location / meeting link on time slots
`study_slots` (migration `0007_scheduling.sql`) currently only stores
`starts_at`. Add a field for where the session happens — a physical
address for in-person studies or a meeting link (Zoom/Meet/Teams URL) for
online ones. Needs:
- A migration adding a `location` text column to `study_slots`.
- Researcher-side slot creation UI updated to require/accept it (could
  branch on the study's existing `format` field — online vs in_person —
  to show "meeting link" vs "address" as the field label).
- Surfaced to the participant on the scheduling/booking page and on their
  applications view once a slot is booked, and included in the
  slot-booked email notification (`sendSlotBookedEmail` in `src/lib/email.ts`).

## Previously identified, still open
- **Resend domain verification** — blocks transactional email to anyone
  other than the account owner until a custom sending domain is verified.
  Single biggest blocker for real launch.
- **DNS propagation** for `prabinbhatta.com.np` → Vercel nameservers — in
  progress, ETA 1-2 days from 2026-08-23.
- **Final product name** — deferred by founder; current working name is
  "Research Platform."
- **Bilingual coverage** — landing page, signup, and the participant
  browse/study-detail/apply flow are translated. Researcher-side pages,
  the rest of the participant dashboard (applications, messages,
  scheduling, incentives), and admin are still English-only.
- **VoiceWaveform hint text** ("Hover to hear a moment from a real
  session.") on the landing page is still English-only.
