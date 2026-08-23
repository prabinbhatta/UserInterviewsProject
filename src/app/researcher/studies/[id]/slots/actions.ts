"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SlotFormState = { error: string | null };

export async function addSlot(
  studyId: string,
  _prevState: SlotFormState,
  formData: FormData,
): Promise<SlotFormState> {
  const startsAt = String(formData.get("starts_at") ?? "");
  if (!startsAt) return { error: "Pick a date and time." };

  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return { error: "Invalid date/time." };
  if (date.getTime() < Date.now()) {
    return { error: "Pick a time in the future." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("study_slots")
    .insert({ study_id: studyId, starts_at: date.toISOString() });

  if (error) return { error: error.message };

  revalidatePath(`/researcher/studies/${studyId}/slots`);
  return { error: null };
}

export async function deleteSlot(studyId: string, slotId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("study_slots")
    .delete()
    .eq("id", slotId)
    .is("application_id", null);
  if (error) throw new Error(error.message);
  revalidatePath(`/researcher/studies/${studyId}/slots`);
}
