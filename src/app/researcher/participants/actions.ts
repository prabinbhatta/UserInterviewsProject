"use server";

import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/friendlyError";

export type InviteParticipantState = {
  error: string | null;
  invitedToken: string | null;
};

export async function inviteParticipant(
  studyId: string,
  participantId: string,
  _prevState: InviteParticipantState,
): Promise<InviteParticipantState> {
  const supabase = await createClient();

  const { data: contact, error: contactError } = (await supabase
    .rpc("get_participant_contact", { p_participant_id: participantId })
    .maybeSingle()) as {
    data: { email: string; full_name: string | null } | null;
    error: unknown;
  };

  if (contactError || !contact?.email) {
    return { error: "Could not find that participant.", invitedToken: null };
  }

  const { data: invite, error: insertError } = await supabase
    .from("study_invitations")
    .insert({ study_id: studyId, email: contact.email, full_name: contact.full_name })
    .select("token")
    .single();

  if (insertError) {
    return { error: friendlyError(insertError), invitedToken: null };
  }

  return { error: null, invitedToken: invite.token };
}
