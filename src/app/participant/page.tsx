import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { one } from "@/lib/one";

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
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <h1 className="min-w-0 text-2xl font-semibold text-zinc-900">
            Welcome, {profile?.full_name ?? user.email}
          </h1>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/settings"
              className="whitespace-nowrap text-sm text-zinc-500 underline"
            >
              Settings
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="whitespace-nowrap text-sm text-zinc-500 underline"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
        <p className="mt-4 text-zinc-600">
          Find studies that fit and apply for the ones you want to join.
        </p>

        <Link
          href="/participant/profile"
          className="mt-6 block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-900">
              {strengthPercent === 100
                ? "Your profile is complete"
                : "Complete your profile"}
            </span>
            <span className="text-zinc-500">{strengthPercent}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${strengthPercent}%` }}
            />
          </div>
          {strengthPercent < 100 && (
            <p className="mt-2 text-xs text-zinc-500">
              A complete profile helps researchers see you&apos;re a good
              match for their study.
            </p>
          )}
        </Link>

        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Total earned so far</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">
            NPR {totalEarned}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/participant/studies"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Browse studies
          </Link>
          <Link
            href="/participant/applications"
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Your applications
          </Link>
        </div>
      </div>
    </div>
  );
}
