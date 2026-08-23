"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/friendlyError";

export type SettingsFormState = { error: string | null; saved?: boolean };

export async function updateNotificationPreferences(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const { error } = await supabase
    .from("profiles")
    .update({
      notify_approved: formData.get("notify_approved") === "on",
      notify_scheduled: formData.get("notify_scheduled") === "on",
      notify_messages: formData.get("notify_messages") === "on",
      notify_incentives: formData.get("notify_incentives") === "on",
    })
    .eq("id", user.id);

  if (error) return { error: friendlyError(error) };

  revalidatePath("/settings");
  return { error: null, saved: true };
}
