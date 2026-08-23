import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function releaseBookedSlot(
  supabase: SupabaseServerClient,
  applicationId: string,
) {
  const { data: application } = await supabase
    .from("applications")
    .select("status")
    .eq("id", applicationId)
    .single();

  if (application?.status !== "scheduled") {
    throw new Error("This session isn't currently scheduled.");
  }

  const { error: slotError } = await supabase
    .from("study_slots")
    .update({ application_id: null })
    .eq("application_id", applicationId);
  if (slotError) throw new Error(slotError.message);

  const { error: statusError } = await supabase
    .from("applications")
    .update({ status: "approved" })
    .eq("id", applicationId);
  if (statusError) throw new Error(statusError.message);
}
