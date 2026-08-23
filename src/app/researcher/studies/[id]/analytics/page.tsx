import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { one } from "@/lib/one";

const FUNNEL_STEPS = [
  "qualified",
  "rejected",
  "approved",
  "scheduled",
  "completed",
  "no_show",
  "withdrawn",
] as const;

const FUNNEL_LABELS: Record<(typeof FUNNEL_STEPS)[number], string> = {
  qualified: "Qualified (pending review)",
  rejected: "Not a match",
  approved: "Approved",
  scheduled: "Scheduled",
  completed: "Completed",
  no_show: "No-show",
  withdrawn: "Withdrawn",
};

export default async function StudyAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: study } = await supabase
    .from("studies")
    .select("id, title, researcher_id")
    .eq("id", id)
    .single();

  if (!study || study.researcher_id !== user.id) {
    notFound();
  }

  const { data: applications } = await supabase
    .from("applications")
    .select("status, incentive_records(status, amount)")
    .eq("study_id", id);

  const rows = applications ?? [];
  const totalApplied = rows.length;

  const counts = Object.fromEntries(
    FUNNEL_STEPS.map((s) => [s, 0]),
  ) as Record<(typeof FUNNEL_STEPS)[number], number>;
  for (const row of rows) {
    if (row.status in counts) counts[row.status as (typeof FUNNEL_STEPS)[number]] += 1;
  }

  const notMatchRate =
    totalApplied > 0 ? Math.round((counts.rejected / totalApplied) * 100) : 0;

  const receivedIncentives = rows
    .map((r) => one(r.incentive_records))
    .filter((i) => i?.status === "received");
  const averageIncentive =
    receivedIncentives.length > 0
      ? receivedIncentives.reduce((sum, i) => sum + (i?.amount ?? 0), 0) /
        receivedIncentives.length
      : null;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className="text-sm text-zinc-500 underline">
          Back to studies
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Analytics — {study.title}
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">Total applicants</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              {totalApplied}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">Not-a-match rate</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              {totalApplied > 0 ? `${notMatchRate}%` : "—"}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Includes both automatic screener disqualifications and manual
              rejections.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 sm:col-span-2">
            <p className="text-sm text-zinc-500">Average incentive paid</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              {averageIncentive !== null
                ? `NPR ${averageIncentive.toFixed(0)}`
                : "—"}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Across {receivedIncentives.length} confirmed-received incentive
              {receivedIncentives.length === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="font-semibold text-zinc-900">Applicant funnel</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {FUNNEL_STEPS.map((step) => (
              <div key={step} className="flex items-center justify-between">
                <dt className="text-zinc-600">{FUNNEL_LABELS[step]}</dt>
                <dd className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-zinc-900"
                      style={{
                        width: `${totalApplied > 0 ? (counts[step] / totalApplied) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-medium text-zinc-900">
                    {counts[step]}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
