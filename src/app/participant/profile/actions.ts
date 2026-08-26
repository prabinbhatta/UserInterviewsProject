"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/friendlyError";
import { DISTRICTS } from "@/lib/districts";

export type ProfileFormState = {
  error: string | null;
  saved?: boolean;
  values?: {
    district: string | null;
    age: number | null;
    occupation: string | null;
    income_band: string | null;
    languages: string[];
    devices: string[];
  };
};

const DISTRICT_SET = new Set(DISTRICTS);

export async function updateParticipantProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const districtChoice = String(formData.get("district") ?? "").trim();
  const districtOther = String(formData.get("district_other") ?? "").trim();
  const district =
    districtChoice === "Other" ? districtOther : districtChoice;

  const ageRaw = String(formData.get("age") ?? "").trim();
  const age = ageRaw ? Number(ageRaw) : null;
  if (ageRaw && (!Number.isFinite(age) || age! <= 0 || age! > 120)) {
    return { error: "Enter a valid age." };
  }

  const occupation = String(formData.get("occupation") ?? "").trim();
  const incomeBand = String(formData.get("income_band") ?? "").trim();
  const languages = formData.getAll("languages").map(String);
  const devices = formData.getAll("devices").map(String);

  if (districtChoice && !DISTRICT_SET.has(districtChoice)) {
    return { error: "Invalid district selection." };
  }

  const values = {
    district: district || null,
    age,
    occupation: occupation || null,
    income_band: incomeBand || null,
    languages,
    devices,
  };

  const { error } = await supabase
    .from("participant_profiles")
    .upsert({ user_id: user.id, ...values }, { onConflict: "user_id" });

  if (error) return { error: friendlyError(error) };

  revalidatePath("/participant/profile");
  revalidatePath("/participant");
  return { error: null, saved: true, values };
}
