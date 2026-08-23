"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = { error: string | null; saved?: boolean };

const DISTRICTS = new Set([
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Chitwan",
  "Biratnagar",
  "Other",
]);

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

  if (districtChoice && !DISTRICTS.has(districtChoice)) {
    return { error: "Invalid district selection." };
  }

  const { error } = await supabase.from("participant_profiles").upsert(
    {
      user_id: user.id,
      district: district || null,
      age,
      occupation: occupation || null,
      income_band: incomeBand || null,
      languages,
      devices,
    },
    { onConflict: "user_id" },
  );

  if (error) return { error: error.message };

  revalidatePath("/participant/profile");
  revalidatePath("/participant");
  return { error: null, saved: true };
}
