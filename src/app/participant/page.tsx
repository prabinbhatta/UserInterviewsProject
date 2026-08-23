import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { one } from "@/lib/one";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function ParticipantDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "participant") {
    redirect("/researcher");
  }

  const { data: participantProfile } = await supabase
    .from("participant_profiles")
    .select("district, age, occupation, income_band, languages, devices")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: myApplications } = await supabase
    .from("applications")
    .select("incentive_records(status, amount)")
    .eq("participant_id", user.id);

  const totalEarned = (myApplications ?? [])
    .map((a) => one(a.incentive_records))
    .filter((i) => i?.status === "received")
    .reduce((sum, i) => sum + (i?.amount ?? 0), 0);

  const fieldsFilled = [
    participantProfile?.district,
    participantProfile?.age,
    participantProfile?.occupation,
    participantProfile?.income_band,
    participantProfile?.languages?.length ? "yes" : null,
    participantProfile?.devices?.length ? "yes" : null,
  ].filter(Boolean).length;
  const strengthPercent = Math.round((fieldsFilled / 6) * 100);

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <h1 className="min-w-0 font-serif-display text-3xl font-medium text-[var(--ink)]">
            Welcome, {profile?.full_name ?? user.email}
          </h1>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/settings"
              className="whitespace-nowrap text-sm text-[var(--ink)]/50 underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
            >
              Settings
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="whitespace-nowrap text-sm text-[var(--ink)]/50 underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
        <p className="mt-4 text-[var(--ink)]/70">
          Find studies that fit and apply for the ones you want to join.
        </p>

        <Link href="/participant/profile" className="mt-6 block">
          <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--coral)]">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--ink)]">
                {strengthPercent === 100
                  ? "Your profile is complete"
                  : "Complete your profile"}
              </span>
              <span className="text-[var(--ink)]/50">{strengthPercent}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--mist)]/40">
              <div
                className="h-full rounded-full bg-[var(--coral)] transition-all"
                style={{ width: `${strengthPercent}%` }}
              />
            </div>
            {strengthPercent < 100 && (
              <p className="mt-2 text-xs text-[var(--ink)]/50">
                A complete profile helps researchers see you&apos;re a good
                match for their study.
              </p>
            )}
          </Card>
        </Link>

        <Card className="mt-4">
          <p className="text-sm text-[var(--ink)]/50">Total earned so far</p>
          <p className="mt-1 font-serif-display text-3xl font-medium text-[var(--ink)]">
            NPR {totalEarned}
          </p>
        </Card>

        <div className="mt-6 flex gap-3">
          <LinkButton href="/participant/studies" variant="primary">
            Browse studies
          </LinkButton>
          <LinkButton href="/participant/applications" variant="secondary">
            Your applications
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
