import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";
import { getLang } from "@/lib/getLang";
import { mutedLinkClasses } from "@/components/ui/link";

export default async function ParticipantProfilePage() {
  const { t } = await getLang();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: participantProfile } = await supabase
    .from("participant_profiles")
    .select("district, age, occupation, income_band, languages, devices")
    .eq("user_id", user.id)
    .maybeSingle();

  const defaultValues = {
    district: participantProfile?.district ?? null,
    age: participantProfile?.age ?? null,
    occupation: participantProfile?.occupation ?? null,
    income_band: participantProfile?.income_band ?? null,
    languages: participantProfile?.languages ?? [],
    devices: participantProfile?.devices ?? [],
  };

  const fieldsFilled = [
    defaultValues.district,
    defaultValues.age,
    defaultValues.occupation,
    defaultValues.income_band,
    defaultValues.languages.length > 0 ? "yes" : null,
    defaultValues.devices.length > 0 ? "yes" : null,
  ].filter(Boolean).length;
  const strengthPercent = Math.round((fieldsFilled / 6) * 100);

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/participant" className={`text-sm ${mutedLinkClasses}`}>
          {t("backToDashboard")}
        </Link>
        <h1 className="mt-2 font-serif-display text-3xl font-medium text-[var(--ink)]">
          {t("yourProfileTitle")}
        </h1>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          {t("profileHint")}
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[var(--ink)]/80">{t("profileStrengthLabel")}</span>
            <span className="text-[var(--ink)]/70">{strengthPercent}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--mist)]/40">
            <div
              className="h-full rounded-full bg-[var(--coral)] transition-all"
              style={{ width: `${strengthPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-8">
          <ProfileForm defaultValues={defaultValues} />
        </div>
      </div>
    </div>
  );
}
