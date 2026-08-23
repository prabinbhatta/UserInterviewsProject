"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendIncentiveSentEmail } from "@/lib/email";
import { one } from "@/lib/one";
import { reopenStudyIfUnderCapacity } from "@/lib/closeStudyIfFull";
import { friendlyError } from "@/lib/friendlyError";

type StudyIncentive = { incentive_amount: number } | { incentive_amount: number }[] | null;

function readIncentiveAmount(studies: StudyIncentive): number {
  if (!studies) return 0;
  if (Array.isArray(studies)) return studies[0]?.incentive_amount ?? 0;
  return studies.incentive_amount ?? 0;
}

export async function markSessionCompleted(
  applicationId: string,
  revalidateTargetPath: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in.");

  const { data: application } = await supabase
    .from("applications")
    .select("id, status, studies(incentive_amount)")
    .eq("id", applicationId)
    .single();

  if (!application) throw new Error("Application not found.");
  if (application.status !== "scheduled") {
    throw new Error("Only a scheduled session can be marked completed.");
  }

  const { error: statusError } = await supabase
    .from("applications")
    .update({ status: "completed" })
    .eq("id", applicationId);
  if (statusError) throw new Error(friendlyError(statusError));

  const amount = readIncentiveAmount(application.studies as StudyIncentive);

  const { error: incentiveError } = await supabase
    .from("incentive_records")
    .upsert(
      { application_id: applicationId, amount, status: "pending" },
      { onConflict: "application_id" },
    );
  if (incentiveError) throw new Error(friendlyError(incentiveError));

  revalidatePath(revalidateTargetPath);
}

export async function markNoShow(
  applicationId: string,
  revalidateTargetPath: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in.");

  const { data: application } = await supabase
    .from("applications")
    .select("id, status, study_id")
    .eq("id", applicationId)
    .single();

  if (!application) throw new Error("Application not found.");
  if (application.status !== "scheduled") {
    throw new Error("Only a scheduled session can be marked as a no-show.");
  }

  const { error: statusError } = await supabase
    .from("applications")
    .update({ status: "no_show" })
    .eq("id", applicationId);
  if (statusError) throw new Error(friendlyError(statusError));

  // Free the slot for reuse. Unlike a cancellation, the application itself
  // stays at 'no_show' rather than reverting to 'approved' — a researcher
  // who wants to give this participant another chance already has "Cancel
  // booking" for that; this path is for when they don't.
  const { error: slotError } = await supabase
    .from("study_slots")
    .update({ application_id: null })
    .eq("application_id", applicationId);
  if (slotError) throw new Error(friendlyError(slotError));

  // 'no_show' no longer counts toward participants_needed, so a study
  // that auto-closed at capacity may now have a spot open again.
  await reopenStudyIfUnderCapacity(supabase, application.study_id);

  revalidatePath(revalidateTargetPath);
}

export async function sendIncentive(
  applicationId: string,
  revalidateTargetPath: string,
) {
  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("incentive_records")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("application_id", applicationId)
    .eq("status", "pending")
    .select("amount")
    .maybeSingle();
  if (error) throw new Error(friendlyError(error));
  revalidatePath(revalidateTargetPath);

  if (updated) {
    const { data: application } = await supabase
      .from("applications")
      .select("profiles(email), studies(title)")
      .eq("id", applicationId)
      .single();
    const participant = one(application?.profiles);
    const study = one(application?.studies);
    if (participant?.email && study?.title) {
      await sendIncentiveSentEmail(participant.email, study.title, updated.amount);
    }
  }
}

export async function confirmIncentiveReceived(
  applicationId: string,
  revalidateTargetPath: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("incentive_records")
    .update({ status: "received", responded_at: new Date().toISOString() })
    .eq("application_id", applicationId)
    .eq("status", "sent");
  if (error) throw new Error(friendlyError(error));
  revalidatePath(revalidateTargetPath);
}

export async function reportIncentiveNotReceived(
  applicationId: string,
  revalidateTargetPath: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("incentive_records")
    .update({ status: "not_received", responded_at: new Date().toISOString() })
    .eq("application_id", applicationId)
    .eq("status", "sent");
  if (error) throw new Error(friendlyError(error));
  revalidatePath(revalidateTargetPath);
}
