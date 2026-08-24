import { createClient } from "@/lib/supabase/server";
import { sendWaitlistSpotOpenEmail } from "@/lib/email";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

// Delegates to a SECURITY DEFINER Postgres function rather than doing the
// check-then-update here — this gets called from both researcher- and
// participant-initiated actions, and only a researcher has RLS UPDATE
// rights on `studies`. The function bypasses RLS regardless of caller.
export async function closeStudyIfFull(
  supabase: SupabaseServerClient,
  studyId: string,
) {
  await supabase.rpc("close_study_if_full", { target_study_id: studyId });
}

// The reverse case: a study that auto-closed because it filled up can
// free a spot again — a participant withdraws, or a researcher marks
// someone a no-show. Reopen it so new applicants can be considered.
export async function reopenStudyIfUnderCapacity(
  supabase: SupabaseServerClient,
  studyId: string,
) {
  const { data: waitlisted } = await supabase.rpc(
    "reopen_study_if_under_capacity",
    { target_study_id: studyId },
  );

  if (!waitlisted || waitlisted.length === 0) return;

  const { data: study } = await supabase
    .from("studies")
    .select("title")
    .eq("id", studyId)
    .single();

  for (const entry of waitlisted) {
    if (entry.email) {
      await sendWaitlistSpotOpenEmail(entry.email, study?.title ?? "a study", studyId);
    }
  }
}
