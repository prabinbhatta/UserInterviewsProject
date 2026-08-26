"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/friendlyError";

export type SettingsFormState = {
  error: string | null;
  saved?: boolean;
  values?: {
    notify_approved: boolean;
    notify_scheduled: boolean;
    notify_messages: boolean;
    notify_incentives: boolean;
  };
};

export async function updateNotificationPreferences(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const values = {
    notify_approved: formData.get("notify_approved") === "on",
    notify_scheduled: formData.get("notify_scheduled") === "on",
    notify_messages: formData.get("notify_messages") === "on",
    notify_incentives: formData.get("notify_incentives") === "on",
  };

  const { error } = await supabase.from("profiles").update(values).eq("id", user.id);

  if (error) return { error: friendlyError(error) };

  revalidatePath("/settings");
  return { error: null, saved: true, values };
}
