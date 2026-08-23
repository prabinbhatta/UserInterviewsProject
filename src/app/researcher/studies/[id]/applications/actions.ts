"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function approveApplication(studyId: string, applicationId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status: "approved" })
    .eq("id", applicationId);
  if (error) throw new Error(error.message);
  revalidatePath(`/researcher/studies/${studyId}/applications`);
}

export async function rejectApplication(studyId: string, applicationId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status: "rejected" })
    .eq("id", applicationId);
  if (error) throw new Error(error.message);
  revalidatePath(`/researcher/studies/${studyId}/applications`);
}
