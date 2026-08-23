"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendApprovedEmail } from "@/lib/email";
import { one } from "@/lib/one";
import { closeStudyIfFull } from "@/lib/closeStudyIfFull";
import { friendlyError } from "@/lib/friendlyError";

export async function approveApplication(studyId: string, applicationId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status: "approved" })
    .eq("id", applicationId);
  if (error) throw new Error(friendlyError(error));

  await closeStudyIfFull(supabase, studyId);
  revalidatePath(`/researcher/studies/${studyId}/applications`);

  const { data: application } = await supabase
    .from("applications")
    .select("profiles(email, notify_approved), studies(title)")
    .eq("id", applicationId)
    .single();

  const participant = one(application?.profiles);
  const study = one(application?.studies);
  if (participant?.email && study?.title && participant.notify_approved) {
    await sendApprovedEmail(participant.email, study.title);
  }
}

export async function rejectApplication(studyId: string, applicationId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status: "rejected" })
    .eq("id", applicationId);
  if (error) throw new Error(friendlyError(error));
  revalidatePath(`/researcher/studies/${studyId}/applications`);
}
