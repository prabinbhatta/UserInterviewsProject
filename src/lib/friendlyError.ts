// Translates raw Postgres/PostgREST/Supabase Auth errors into plain-language
// copy. Only for errors that came directly from a Supabase call — an Error
// we threw ourselves (e.g. "Only a scheduled session can be marked
// completed.") is already user-facing and shouldn't go through this.

type SupabaseLikeError =
  | { message?: string; code?: string; status?: number }
  | null
  | undefined;

const MESSAGE_MAP: Record<string, string> = {
  "Email not confirmed":
    "Please confirm your email first — check your inbox for the link.",
  "Invalid login credentials": "Incorrect email or password.",
  "User already registered":
    "An account with that email already exists — try logging in instead.",
  "A user with this email address has already been registered":
    "An account with that email already exists — try logging in instead.",
  "Password should be at least 6 characters":
    "Password must be at least 8 characters.",
  "Email link is invalid or has expired":
    "That link is invalid or has expired — request a new one.",
  "Token has expired or is invalid":
    "That link is invalid or has expired — request a new one.",
  "New password should be different from the old password":
    "Your new password must be different from your current one.",
};

// Postgres error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
const CODE_MAP: Record<string, string> = {
  "23505": "That already exists — try a different value.",
  "23503": "That's still linked to other data, so it can't be removed.",
  "23502": "A required field is missing.",
  "23514": "That value isn't valid.",
  "42501": "You don't have permission to do that.",
  "PGRST116": "That couldn't be found — it may have been removed.",
};

// Matched by prefix rather than exact text — Supabase's rate-limit messages
// embed a changing wait time ("...after 46 seconds"), so an exact-match
// lookup would never hit.
const MESSAGE_PREFIX_MAP: [string, string][] = [
  ["For security purposes", "Too many attempts — please wait a bit and try again."],
];

export function friendlyError(
  error: SupabaseLikeError,
  fallback = "Something went wrong — please try again.",
): string {
  if (!error) return fallback;
  if (error.code && CODE_MAP[error.code]) return CODE_MAP[error.code];
  if (error.message && MESSAGE_MAP[error.message]) {
    return MESSAGE_MAP[error.message];
  }
  if (error.message) {
    const prefixMatch = MESSAGE_PREFIX_MAP.find(([prefix]) =>
      error.message!.startsWith(prefix),
    );
    if (prefixMatch) return prefixMatch[1];
  }
  if (error.status === 429) {
    return "Too many attempts — please wait a bit and try again.";
  }
  return fallback;
}
