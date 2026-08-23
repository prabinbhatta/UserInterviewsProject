import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { adminResolveIncentive } from "./actions";

const studyStatuses = ["draft", "active", "closed"] as const;
const applicationStatuses = [
  "qualified",
  "rejected",
  "approved",
  "scheduled",
  "completed",
] as const;
const incentiveStatuses = ["pending", "sent", "received", "not_received"] as const;

function countBy<T extends string>(
  rows: { status: T }[] | null,
  statuses: readonly T[],
): Record<T, number> {
  const counts = Object.fromEntries(statuses.map((s) => [s, 0])) as Record<T, number>;
  for (const row of rows ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/researcher");
  }

  const [studiesRes, applicationsRes, incentivesRes, profilesRes] =
    await Promise.all([
      supabase.from("studies").select("id, title, status, researcher_id"),
      supabase.from("applications").select("id, status, study_id, participant_id"),
      supabase
        .from("incentive_records")
        .select("id, application_id, status, amount"),
      supabase.from("profiles").select("id, full_name"),
    ]);

  const studies = studiesRes.data ?? [];
  const applications = applicationsRes.data ?? [];
  const incentives = incentivesRes.data ?? [];
  const nameById = new Map((profilesRes.data ?? []).map((p) => [p.id, p.full_name]));
  const studyById = new Map(studies.map((s) => [s.id, s]));
  const applicationById = new Map(applications.map((a) => [a.id, a]));

  const studyCounts = countBy(studies, studyStatuses);
  const applicationCounts = countBy(applications, applicationStatuses);
  const incentiveCounts = countBy(incentives, incentiveStatuses);

  const needsAttention = incentives
    .filter((i) => i.status === "not_received")
    .map((incentive) => {
      const application = applicationById.get(incentive.application_id);
      const study = application ? studyById.get(application.study_id) : undefined;
      return {
        ...incentive,
        studyTitle: study?.title ?? "Unknown study",
        researcherName: study ? nameById.get(study.researcher_id) : undefined,
        participantName: application
          ? nameById.get(application.participant_id)
          : undefined,
      };
    });

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
              Platform overview
            </h1>
          </div>
          <form action={signOut} className="shrink-0">
            <button
              type="submit"
              className="text-sm text-zinc-500 underline whitespace-nowrap"
            >
              Log out
            </button>
          </form>
        </div>

        {needsAttention.length > 0 && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5">
            <h2 className="font-semibold text-red-900">
              Needs your attention ({needsAttention.length})
            </h2>
            <p className="mt-1 text-sm text-red-800">
              Participants who reported an incentive as not received.
              Investigate off-platform, then resolve once confirmed.
            </p>
            <ul className="mt-4 space-y-2">
              {needsAttention.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="text-sm">
                    <p className="font-medium text-zinc-900">
                      {item.studyTitle} — NPR {item.amount}
                    </p>
                    <p className="text-zinc-600">
                      Participant: {item.participantName ?? "Unknown"} ·
                      Researcher: {item.researcherName ?? "Unknown"}
                    </p>
                  </div>
                  <form action={adminResolveIncentive.bind(null, item.application_id)}>
                    <button
                      type="submit"
                      className="shrink-0 rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                    >
                      Mark resolved
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="font-semibold text-zinc-900">Studies</h2>
            <dl className="mt-3 space-y-1 text-sm">
              {studyStatuses.map((s) => (
                <div key={s} className="flex justify-between">
                  <dt className="text-zinc-600 capitalize">{s}</dt>
                  <dd className="font-medium text-zinc-900">{studyCounts[s]}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="font-semibold text-zinc-900">Applications</h2>
            <dl className="mt-3 space-y-1 text-sm">
              {applicationStatuses.map((s) => (
                <div key={s} className="flex justify-between">
                  <dt className="text-zinc-600 capitalize">{s}</dt>
                  <dd className="font-medium text-zinc-900">
                    {applicationCounts[s]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="font-semibold text-zinc-900">Incentives</h2>
            <dl className="mt-3 space-y-1 text-sm">
              {incentiveStatuses.map((s) => (
                <div key={s} className="flex justify-between">
                  <dt className="text-zinc-600 capitalize">
                    {s.replace("_", " ")}
                  </dt>
                  <dd className="font-medium text-zinc-900">
                    {incentiveCounts[s]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
