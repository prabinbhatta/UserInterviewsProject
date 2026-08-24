"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { reopenStudyIfUnderCapacity } from "@/lib/closeStudyIfFull";
import { friendlyError } from "@/lib/friendlyError";

export async function withdrawApplication(applicationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in.");

  const { data: application } = await supabase
    .from("applications")
    .select("status, study_id")
    .eq("id", applicationId)
    .eq("participant_id", user.id)
    .single();

  if (!application) throw new Error("Application not found.");
  if (!["qualified", "approved"].includes(application.status)) {
    throw new Error("This application can no longer be withdrawn.");
  }

  const { error } = await supabase
    .from("applications")
    .update({ status: "withdrawn" })
    .eq("id", applicationId);
  if (error) throw new Error(friendlyError(error));

  if (application.status === "approved") {
    await reopenStudyIfUnderCapacity(supabase, application.study_id);
  }

  revalidatePath("/participant/applications");
}

export async function submitParticipantRating(
  applicationId: string,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in.");

  const rating = Number(formData.get("rating"));
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Pick a rating from 1 to 5 stars.");
  }
  const comment = String(formData.get("comment") ?? "").trim() || null;

  const { error } = await supabase.from("session_ratings").insert({
    application_id: applicationId,
    rater_role: "participant",
    rating,
    comment,
  });
  if (error) throw new Error(friendlyError(error));

  revalidatePath("/participant/applications");
}
