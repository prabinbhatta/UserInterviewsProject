"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
  return { error: null };
}
