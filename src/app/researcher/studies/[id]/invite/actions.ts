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

export type CsvImportState = { error: string | null; imported: number | null };

export async function importInvitesFromCsv(
  studyId: string,
  _prevState: CsvImportState,
  formData: FormData,
): Promise<CsvImportState> {
  const raw = String(formData.get("rows") ?? "[]");
  let rows: { email?: string; full_name?: string }[];
  try {
    rows = JSON.parse(raw);
  } catch {
    return { error: "Could not read the uploaded file.", imported: null };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const seen = new Set<string>();
  const validRows = rows
    .map((r) => ({
      email: String(r.email ?? "").trim(),
      full_name: String(r.full_name ?? "").trim() || null,
    }))
    .filter((r) => {
      const normalized = r.email.toLowerCase();
      if (!emailPattern.test(r.email) || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });

  if (validRows.length === 0) {
    return { error: "No valid rows to import.", imported: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("study_invitations").insert(
    validRows.map((r) => ({
      study_id: studyId,
      email: r.email,
      full_name: r.full_name,
    })),
  );

  if (error) return { error: friendlyError(error), imported: null };

  revalidatePath(`/researcher/studies/${studyId}/invite`);
  return { error: null, imported: validRows.length };
}
