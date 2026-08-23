"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendSlotBookedEmail, sendBookingCancelledEmail } from "@/lib/email";
import { one } from "@/lib/one";
import { releaseBookedSlot } from "@/lib/cancelBooking";

export async function bookSlot(applicationId: string, slotId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in.");

  const { data: claimedSlot, error: claimError } = await supabase
    .from("study_slots")
    .update({ application_id: applicationId })
    .eq("id", slotId)
    .is("application_id", null)
    .select("id, starts_at")
    .maybeSingle();

  if (claimError) throw new Error(claimError.message);
  if (!claimedSlot) {
    throw new Error("That slot was just booked by someone else — pick another.");
  }

  const { error: statusError } = await supabase
    .from("applications")
    .update({ status: "scheduled" })
    .eq("id", applicationId)
    .eq("participant_id", user.id);

  if (statusError) throw new Error(statusError.message);

  revalidatePath(`/participant/applications/${applicationId}/schedule`);
  revalidatePath("/participant/applications");

  const { data: application } = await supabase
    .from("applications")
    .select("profiles(full_name), studies(title, profiles(email))")
    .eq("id", applicationId)
    .single();

  const participant = one(application?.profiles);
  const study = one(application?.studies);
  const researcher = one(study?.profiles);
  if (researcher?.email && study?.title) {
    await sendSlotBookedEmail(
      researcher.email,
      study.title,
      participant?.full_name ?? "A participant",
      new Date(claimedSlot.starts_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    );
  }
}

export async function cancelMyBooking(applicationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in.");

  await releaseBookedSlot(supabase, applicationId);

  revalidatePath(`/participant/applications/${applicationId}/schedule`);
  revalidatePath("/participant/applications");

  const { data: application } = await supabase
    .from("applications")
    .select("study_id, profiles(full_name), studies(title, profiles(email))")
    .eq("id", applicationId)
    .single();

  const participant = one(application?.profiles);
  const study = one(application?.studies);
  const researcher = one(study?.profiles);
  if (researcher?.email && study?.title && application?.study_id) {
    await sendBookingCancelledEmail(
      researcher.email,
      study.title,
      participant?.full_name ?? "The participant",
      `/researcher/studies/${application.study_id}/slots`,
    );
  }
}
