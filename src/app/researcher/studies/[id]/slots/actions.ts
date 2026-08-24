"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { releaseBookedSlot } from "@/lib/cancelBooking";
import { sendBookingCancelledEmail } from "@/lib/email";
import { createGoogleMeetLink } from "@/lib/googleMeet";
import { one } from "@/lib/one";
import { friendlyError } from "@/lib/friendlyError";

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

  let location = String(formData.get("location") ?? "").trim() || null;
  const autoMeet = formData.get("auto_meet") === "on";

  const supabase = await createClient();

  // Re-check the study's own format server-side rather than trusting
  // whatever the client sent — auto-generating a Meet link only makes
  // sense for an online study, regardless of what the form claimed.
  if (autoMeet) {
    const { data: study } = await supabase
      .from("studies")
      .select("format")
      .eq("id", studyId)
      .single();

    if (study?.format === "online") {
      const meetLink = await createGoogleMeetLink();
      if (meetLink) location = meetLink;
    }
  }

  const { error } = await supabase
    .from("study_slots")
    .insert({ study_id: studyId, starts_at: date.toISOString(), location });

  if (error) return { error: friendlyError(error) };

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
  if (error) throw new Error(friendlyError(error));
  revalidatePath(`/researcher/studies/${studyId}/slots`);
}

export async function cancelBooking(studyId: string, applicationId: string) {
  const supabase = await createClient();
  await releaseBookedSlot(supabase, applicationId);
  revalidatePath(`/researcher/studies/${studyId}/slots`);

  const { data: application } = await supabase
    .from("applications")
    .select("profiles(email, notify_scheduled), studies(title)")
    .eq("id", applicationId)
    .single();

  const participant = one(application?.profiles);
  const study = one(application?.studies);
  if (participant?.email && study?.title && participant.notify_scheduled) {
    await sendBookingCancelledEmail(
      participant.email,
      study.title,
      "The researcher",
      `/participant/applications/${applicationId}/schedule`,
    );
  }
}
