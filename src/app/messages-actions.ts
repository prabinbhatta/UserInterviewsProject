"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendNewMessageEmail } from "@/lib/email";
import { one } from "@/lib/one";

export type MessageFormState = { error: string | null };

export async function sendMessage(
  applicationId: string,
  revalidateTargetPath: string,
  _prevState: MessageFormState,
  formData: FormData,
): Promise<MessageFormState> {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Write a message first." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const { error } = await supabase
    .from("messages")
    .insert({ application_id: applicationId, sender_id: user.id, body });

  if (error) return { error: error.message };

  revalidatePath(revalidateTargetPath);

  const { data: application } = await supabase
    .from("applications")
    .select(
      "participant_id, study_id, profiles(full_name, email), studies(title, researcher_id, profiles(full_name, email))",
    )
    .eq("id", applicationId)
    .single();

  if (application) {
    const participant = one(application.profiles);
    const study = one(application.studies);
    const researcher = one(study?.profiles);
    const senderIsParticipant = application.participant_id === user.id;
    const recipient = senderIsParticipant ? researcher : participant;
    const senderName = senderIsParticipant
      ? (participant?.full_name ?? "A participant")
      : (researcher?.full_name ?? "The researcher");
    // The recipient is on the opposite side of the app from whoever sent
    // this message, so their message thread lives at a different route
    // than revalidateTargetPath (which is the sender's own page) — link
    // to the recipient's own route instead.
    const recipientMessagesPath = senderIsParticipant
      ? `/researcher/studies/${application.study_id}/applications/${applicationId}/messages`
      : `/participant/applications/${applicationId}/messages`;

    if (recipient?.email && study?.title) {
      await sendNewMessageEmail(recipient.email, senderName, study.title, recipientMessagesPath);
    }
  }

  return { error: null };
}
