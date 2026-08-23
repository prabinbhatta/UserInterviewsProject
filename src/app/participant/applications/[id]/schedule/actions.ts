"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
    .select("id")
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
}
