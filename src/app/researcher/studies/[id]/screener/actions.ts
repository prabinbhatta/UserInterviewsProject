"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/friendlyError";

export type ScreenerFormState = { error: string | null };

const CHOICE_TYPES = new Set(["pick_one", "pick_any"]);

export async function addQuestion(
  studyId: string,
  _prevState: ScreenerFormState,
  formData: FormData,
): Promise<ScreenerFormState> {
  const questionText = String(formData.get("question_text") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const required = formData.get("required") === "on";

  if (!questionText) return { error: "Question text is required." };
  if (!["pick_one", "pick_any", "short_answer", "long_answer"].includes(type))
    return { error: "Invalid question type." };

  const labels = formData.getAll("option_label").map((v) => String(v).trim());
  const decisions = formData.getAll("option_decision").map((v) => String(v));

  const options = labels
    .map((label, i) => ({ label, decision: decisions[i] }))
    .filter((o) => o.label.length > 0);

  if (CHOICE_TYPES.has(type)) {
    if (options.length < 2)
      return { error: "Add at least 2 answer options." };
    if (options.some((o) => o.decision !== "accept" && o.decision !== "reject"))
      return { error: "Every option needs an Accept or Reject decision." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const { data: question, error: questionError } = await supabase
    .from("screener_questions")
    .insert({ study_id: studyId, question_text: questionText, type, required })
    .select("id")
    .single();

  if (questionError || !question) {
    return { error: friendlyError(questionError, "Could not save question.") };
  }

  if (CHOICE_TYPES.has(type)) {
    const { error: optionsError } = await supabase
      .from("screener_options")
      .insert(
        options.map((o, i) => ({
          question_id: question.id,
          label: o.label,
          decision: o.decision,
          sort_order: i,
        })),
      );

    if (optionsError) {
      // Roll back the orphaned question so a failed save doesn't leave a
      // question with no options behind.
      await supabase.from("screener_questions").delete().eq("id", question.id);
      return { error: friendlyError(optionsError) };
    }
  }

  revalidatePath(`/researcher/studies/${studyId}/screener`);
  return { error: null };
}

export async function deleteQuestion(studyId: string, questionId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("screener_questions")
    .delete()
    .eq("id", questionId);
  if (error) throw new Error(friendlyError(error));
  revalidatePath(`/researcher/studies/${studyId}/screener`);
}
