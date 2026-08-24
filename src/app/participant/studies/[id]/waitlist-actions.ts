"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/friendlyError";

export async function joinWaitlist(studyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in.");

  const { error } = await supabase
    .from("study_waitlist")
    .insert({ study_id: studyId, participant_id: user.id });
  if (error) throw new Error(friendlyError(error));

  revalidatePath(`/participant/studies/${studyId}`);
}

export async function leaveWaitlist(studyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in.");

  const { error } = await supabase
    .from("study_waitlist")
    .delete()
    .eq("study_id", studyId)
    .eq("participant_id", user.id);
  if (error) throw new Error(friendlyError(error));

  revalidatePath(`/participant/studies/${studyId}`);
}
