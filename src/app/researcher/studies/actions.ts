"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/friendlyError";

export type StudyFormState = { error: string | null };

function parseStudyForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const format = String(formData.get("format") ?? "online");
  const sessionLengthMinutes = Number(formData.get("session_length_minutes"));
  const participantsNeeded = Number(formData.get("participants_needed"));
  const incentiveAmount = Number(formData.get("incentive_amount"));
  const district = String(formData.get("district") ?? "").trim();

  if (!title) return { error: "Title is required." } as const;
  if (!description) return { error: "Description is required." } as const;
  if (!["online", "in_person", "phone"].includes(format))
    return { error: "Invalid format." } as const;
  if (!Number.isFinite(sessionLengthMinutes) || sessionLengthMinutes <= 0)
    return { error: "Session length must be a positive number." } as const;
  if (!Number.isFinite(participantsNeeded) || participantsNeeded <= 0)
    return { error: "Participants needed must be a positive number." } as const;
  if (!Number.isFinite(incentiveAmount) || incentiveAmount < 0)
    return { error: "Incentive amount can't be negative." } as const;

  return {
    error: null,
    values: {
      title,
      description,
      format,
      session_length_minutes: sessionLengthMinutes,
      participants_needed: participantsNeeded,
      incentive_amount: incentiveAmount,
      district: format === "in_person" ? district || null : null,
    },
  } as const;
}

export async function createStudy(
  _prevState: StudyFormState,
  formData: FormData,
): Promise<StudyFormState> {
  const parsed = parseStudyForm(formData);
  if (parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("studies")
    .insert({ ...parsed.values, researcher_id: user.id });

  if (error) return { error: friendlyError(error) };

  revalidatePath("/researcher/studies");
  redirect("/researcher/studies");
}

export async function updateStudy(
  studyId: string,
  _prevState: StudyFormState,
  formData: FormData,
): Promise<StudyFormState> {
  const parsed = parseStudyForm(formData);
  if (parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("studies")
    .update(parsed.values)
    .eq("id", studyId);

  if (error) return { error: friendlyError(error) };

  revalidatePath("/researcher/studies");
  redirect("/researcher/studies");
}

export async function publishStudy(studyId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("studies")
    .update({ status: "active" })
    .eq("id", studyId);
  if (error) throw new Error(friendlyError(error));
  revalidatePath("/researcher/studies");
}

export async function closeStudy(studyId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("studies")
    .update({ status: "closed" })
    .eq("id", studyId);
  if (error) throw new Error(friendlyError(error));
  revalidatePath("/researcher/studies");
}

export async function duplicateStudy(studyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in.");

  const { data: source } = await supabase
    .from("studies")
    .select(
      "title, description, format, session_length_minutes, participants_needed, incentive_amount, district, researcher_id",
    )
    .eq("id", studyId)
    .single();

  if (!source || source.researcher_id !== user.id) {
    throw new Error("Study not found.");
  }

  const { data: newStudy, error: studyError } = await supabase
    .from("studies")
    .insert({
      title: `${source.title} (copy)`,
      description: source.description,
      format: source.format,
      session_length_minutes: source.session_length_minutes,
      participants_needed: source.participants_needed,
      incentive_amount: source.incentive_amount,
      district: source.district,
      researcher_id: user.id,
      status: "draft",
    })
    .select("id")
    .single();

  if (studyError || !newStudy) {
    throw new Error(friendlyError(studyError, "Could not duplicate study."));
  }

  const { data: questions } = await supabase
    .from("screener_questions")
    .select(
      "question_text, type, required, screener_options(label, decision, sort_order)",
    )
    .eq("study_id", studyId)
    .order("created_at", { ascending: true });

  for (const question of questions ?? []) {
    const { data: newQuestion } = await supabase
      .from("screener_questions")
      .insert({
        study_id: newStudy.id,
        question_text: question.question_text,
        type: question.type,
        required: question.required,
      })
      .select("id")
      .single();

    if (!newQuestion) continue;

    const options = question.screener_options ?? [];
    if (options.length > 0) {
      await supabase.from("screener_options").insert(
        options.map((option) => ({
          question_id: newQuestion.id,
          label: option.label,
          decision: option.decision,
          sort_order: option.sort_order,
        })),
      );
    }
  }

  revalidatePath("/researcher/studies");
  redirect(`/researcher/studies/${newStudy.id}/edit`);
}
