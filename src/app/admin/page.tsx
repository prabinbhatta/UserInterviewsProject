import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { adminResolveIncentive, adminResolveReport } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const studyStatuses = ["draft", "active", "closed"] as const;
const applicationStatuses = [
  "qualified",
  "rejected",
  "approved",
  "scheduled",
  "completed",
  "no_show",
  "withdrawn",
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

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    studiesRes,
    applicationsRes,
    incentivesRes,
    profilesRes,
    reportsRes,
    analyticsEventsRes,
  ] = await Promise.all([
    supabase.from("studies").select("id, title, status, researcher_id"),
    supabase.from("applications").select("id, status, study_id, participant_id"),
    supabase
      .from("incentive_records")
      .select("id, application_id, status, amount"),
    supabase.from("profiles").select("id, full_name"),
    supabase
      .from("reports")
      .select("id, reporter_id, reported_user_id, study_id, reason, created_at")
      .eq("status", "open")
      .order("created_at", { ascending: true }),
    supabase
      .from("analytics_events")
      .select("event_type, path")
      .gte("created_at", thirtyDaysAgo.toISOString()),
  ]);

  const studies = studiesRes.data ?? [];
  const applications = applicationsRes.data ?? [];
  const incentives = incentivesRes.data ?? [];
  const openReports = reportsRes.data ?? [];
  const analyticsEvents = analyticsEventsRes.data ?? [];
  const nameById = new Map((profilesRes.data ?? []).map((p) => [p.id, p.full_name]));
  const studyById = new Map(studies.map((s) => [s.id, s]));
  const applicationById = new Map(applications.map((a) => [a.id, a]));

  const studyCounts = countBy(studies, studyStatuses);
  const applicationCounts = countBy(applications, applicationStatuses);
  const incentiveCounts = countBy(incentives, incentiveStatuses);

  const pageviews = analyticsEvents.filter((e) => e.event_type === "pageview");
  const pathCounts = new Map<string, number>();
  for (const view of pageviews) {
    const path = view.path ?? "(unknown)";
    pathCounts.set(path, (pathCounts.get(path) ?? 0) + 1);
  }
  const topPaths = [...pathCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const funnelCounts = {
    signups: analyticsEvents.filter((e) =>
      e.event_type.startsWith("signup_completed"),
    ).length,
    applications: analyticsEvents.filter(
      (e) => e.event_type === "application_submitted",
    ).length,
    completions: analyticsEvents.filter(
      (e) => e.event_type === "session_completed",
    ).length,
  };

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
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--indigo)]">
              Admin
            </p>
            <h1 className="mt-1 font-serif-display text-2xl font-medium text-[var(--ink)]">
              Platform overview
            </h1>
          </div>
          <form action={signOut} className="shrink-0">
            <button
              type="submit"
              className="whitespace-nowrap text-sm text-[var(--ink)]/70 underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
            >
              Log out
            </button>
          </form>
        </div>

        {needsAttention.length > 0 && (
          <div className="mt-8 rounded-2xl border border-[var(--coral)]/30 bg-[var(--coral)]/10 p-5">
            <h2 className="font-semibold text-[#a8371c]">
              Needs your attention ({needsAttention.length})
            </h2>
            <p className="mt-1 text-sm text-[#a8371c]/80">
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
                    <p className="font-medium text-[var(--ink)]">
                      {item.studyTitle} — NPR {item.amount}
                    </p>
                    <p className="text-[var(--ink)]/60">
                      Participant: {item.participantName ?? "Unknown"} ·
                      Researcher: {item.researcherName ?? "Unknown"}
                    </p>
                  </div>
                  <form action={adminResolveIncentive.bind(null, item.application_id)}>
                    <Button type="submit" size="sm" className="shrink-0">
                      Mark resolved
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        )}

        {openReports.length > 0 && (
          <div className="mt-8 rounded-2xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 p-5">
            <h2 className="font-semibold text-[#8a5a00]">
              Open reports ({openReports.length})
            </h2>
            <p className="mt-1 text-sm text-[#8a5a00]/80">
              Users flagged these for review — abusive behavior or a
              suspicious study.
            </p>
            <ul className="mt-4 space-y-2">
              {openReports.map((report) => {
                const study = report.study_id
                  ? studyById.get(report.study_id)
                  : undefined;
                return (
                  <li
                    key={report.id}
                    className="flex flex-col gap-2 rounded-lg bg-white p-3 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="text-sm">
                      <p className="font-medium text-[var(--ink)]">
                        {nameById.get(report.reporter_id) ?? "Unknown"} reported{" "}
                        {report.reported_user_id
                          ? (nameById.get(report.reported_user_id) ?? "Unknown")
                          : "a study"}
                        {study ? ` — ${study.title}` : ""}
                      </p>
                      <p className="mt-1 text-[var(--ink)]/60">{report.reason}</p>
                    </div>
                    <form action={adminResolveReport.bind(null, report.id)}>
                      <Button type="submit" size="sm" className="shrink-0">
                        Mark resolved
                      </Button>
                    </form>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <Card className="mt-8">
          <h2 className="font-semibold text-[var(--ink)]">
            Last 30 days
          </h2>
          <p className="mt-1 text-sm text-[var(--ink)]/60">
            Self-hosted, no cookies or third-party trackers — pageviews are
            counted by path only.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-[var(--ink)]/60">Pageviews</p>
              <p className="mt-1 font-serif-display text-3xl font-medium text-[var(--ink)]">
                {pageviews.length}
              </p>
              {topPaths.length > 0 && (
                <dl className="mt-3 space-y-1 text-sm">
                  {topPaths.map(([path, count]) => (
                    <div key={path} className="flex justify-between gap-4">
                      <dt className="truncate text-[var(--ink)]/60">{path}</dt>
                      <dd className="shrink-0 font-medium text-[var(--ink)]">
                        {count}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div>
              <p className="text-sm text-[var(--ink)]/60">Funnel</p>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--ink)]/60">Signups completed</dt>
                  <dd className="font-medium text-[var(--ink)]">
                    {funnelCounts.signups}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--ink)]/60">Applications submitted</dt>
                  <dd className="font-medium text-[var(--ink)]">
                    {funnelCounts.applications}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--ink)]/60">Sessions completed</dt>
                  <dd className="font-medium text-[var(--ink)]">
                    {funnelCounts.completions}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <h2 className="font-semibold text-[var(--ink)]">Studies</h2>
            <dl className="mt-3 space-y-1 text-sm">
              {studyStatuses.map((s) => (
                <div key={s} className="flex justify-between">
                  <dt className="capitalize text-[var(--ink)]/60">{s}</dt>
                  <dd className="font-medium text-[var(--ink)]">{studyCounts[s]}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <h2 className="font-semibold text-[var(--ink)]">Applications</h2>
            <dl className="mt-3 space-y-1 text-sm">
              {applicationStatuses.map((s) => (
                <div key={s} className="flex justify-between">
                  <dt className="capitalize text-[var(--ink)]/60">
                    {s.replace("_", " ")}
                  </dt>
                  <dd className="font-medium text-[var(--ink)]">
                    {applicationCounts[s]}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <h2 className="font-semibold text-[var(--ink)]">Incentives</h2>
            <dl className="mt-3 space-y-1 text-sm">
              {incentiveStatuses.map((s) => (
                <div key={s} className="flex justify-between">
                  <dt className="capitalize text-[var(--ink)]/60">
                    {s.replace("_", " ")}
                  </dt>
                  <dd className="font-medium text-[var(--ink)]">
                    {incentiveCounts[s]}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
