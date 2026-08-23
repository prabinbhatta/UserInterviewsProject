"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ApplyFormState = { error: string | null };

const CHOICE_TYPES = new Set(["pick_one", "pick_any"]);

export async function applyToStudy(
  studyId: string,
  _prevState: ApplyFormState,
  formData: FormData,
): Promise<ApplyFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("study_id", studyId)
    .eq("participant_id", user.id)
    .maybeSingle();
  if (existing) {
    return { error: "You've already applied to this study." };
  }

  const { data: questions } = await supabase
    .from("screener_questions")
    .select("id, type, required, screener_options(id, decision)")
    .eq("study_id", studyId);

  if (!questions) {
    return { error: "Could not load this study's screener." };
  }

  let anyRejected = false;
  const answerRows: {
    question_id: string;
    answer_text: string | null;
    selected_option_ids: string[];
  }[] = [];

  for (const question of questions) {
    const fieldName = `q_${question.id}`;

    if (CHOICE_TYPES.has(question.type)) {
      const selectedIds = formData.getAll(fieldName).map(String);
      if (question.required && selectedIds.length === 0) {
        return { error: "Please answer all required questions." };
      }
      const validOptionIds = new Set(
        (question.screener_options ?? []).map((o) => o.id),
      );
      if (selectedIds.some((id) => !validOptionIds.has(id))) {
        return { error: "Invalid answer submitted." };
      }
      const rejectedIds = new Set(
        (question.screener_options ?? [])
          .filter((o) => o.decision === "reject")
          .map((o) => o.id),
      );
      if (selectedIds.some((id) => rejectedIds.has(id))) {
        anyRejected = true;
      }
      answerRows.push({
        question_id: question.id,
        answer_text: null,
        selected_option_ids: selectedIds,
      });
    } else {
      const text = String(formData.get(fieldName) ?? "").trim();
      if (question.required && !text) {
        return { error: "Please answer all required questions." };
      }
      answerRows.push({
        question_id: question.id,
        answer_text: text || null,
        selected_option_ids: [],
      });
    }
  }

  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .insert({
      study_id: studyId,
      participant_id: user.id,
      status: anyRejected ? "rejected" : "qualified",
    })
    .select("id")
    .single();

  if (applicationError || !application) {
    return { error: applicationError?.message ?? "Could not submit application." };
  }

  if (answerRows.length > 0) {
    const { error: answersError } = await supabase
      .from("application_answers")
      .insert(
        answerRows.map((row) => ({ ...row, application_id: application.id })),
      );
    if (answersError) {
      await supabase.from("applications").delete().eq("id", application.id);
      return { error: answersError.message };
    }
  }

  redirect("/participant/applications");
}
