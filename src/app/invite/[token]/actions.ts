"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function acceptInvite(token: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: invite } = await supabase
    .from("study_invitations")
    .select("id, study_id, status")
    .eq("token", token)
    .single();

  if (!invite) throw new Error("This invite link is no longer valid.");

  const { data: existingApplication } = await supabase
    .from("applications")
    .select("id")
    .eq("study_id", invite.study_id)
    .eq("participant_id", user.id)
    .maybeSingle();

  if (!existingApplication) {
    const { error: applicationError } = await supabase
      .from("applications")
      .insert({
        study_id: invite.study_id,
        participant_id: user.id,
        status: "approved",
      });
    if (applicationError) throw new Error(applicationError.message);
  }

  const { error: inviteError } = await supabase
    .from("study_invitations")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
      accepted_by: user.id,
    })
    .eq("id", invite.id);
  if (inviteError) throw new Error(inviteError.message);

  redirect("/participant/applications");
}
