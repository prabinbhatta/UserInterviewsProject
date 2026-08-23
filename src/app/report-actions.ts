"use server";

import { createClient } from "@/lib/supabase/server";
import { one } from "@/lib/one";

export type ReportFormState = { error: string | null; success: boolean };

export async function fileReport(
  _prevState: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> {
  const reason = String(formData.get("reason") ?? "").trim();
  const applicationId = String(formData.get("application_id") ?? "") || null;
  const studyId = String(formData.get("study_id") ?? "") || null;

  if (!reason) {
    return { error: "Tell us what happened.", success: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in.", success: false };

  let reportedUserId: string | null = null;
  let resolvedStudyId = studyId;

  if (applicationId) {
    const { data: application } = await supabase
      .from("applications")
      .select("participant_id, study_id, studies(researcher_id)")
      .eq("id", applicationId)
      .single();

    if (application) {
      resolvedStudyId = application.study_id;
      const researcherId = one(application.studies)?.researcher_id ?? null;
      reportedUserId =
        application.participant_id === user.id
          ? researcherId
          : application.participant_id;
    }
  } else if (studyId) {
    const { data: study } = await supabase
      .from("studies")
      .select("researcher_id")
      .eq("id", studyId)
      .single();
    reportedUserId = study?.researcher_id ?? null;
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    reported_user_id: reportedUserId,
    study_id: resolvedStudyId,
    application_id: applicationId,
    reason,
  });

  if (error) return { error: error.message, success: false };

  return { error: null, success: true };
}
