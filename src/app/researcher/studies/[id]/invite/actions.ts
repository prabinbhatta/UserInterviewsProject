"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/friendlyError";

export type InviteFormState = { error: string | null };

function parseEmails(raw: string): string[] {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emails = raw
    .split(/[\n,]/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
  const unique = Array.from(new Set(emails));
  return unique.filter((e) => emailPattern.test(e));
}

export async function createInvites(
  studyId: string,
  _prevState: InviteFormState,
  formData: FormData,
): Promise<InviteFormState> {
  const raw = String(formData.get("emails") ?? "");
  const emails = parseEmails(raw);

  if (emails.length === 0) {
    return { error: "Enter at least one valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("study_invitations")
    .insert(emails.map((email) => ({ study_id: studyId, email })));

  if (error) return { error: friendlyError(error) };

  revalidatePath(`/researcher/studies/${studyId}/invite`);
  return { error: null };
}
