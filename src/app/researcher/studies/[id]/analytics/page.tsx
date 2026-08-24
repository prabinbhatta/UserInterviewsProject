import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { one } from "@/lib/one";
import { getLang } from "@/lib/getLang";
import type { TranslationKey } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { mutedLinkClasses } from "@/components/ui/link";

const FUNNEL_STEPS = [
  "qualified",
  "rejected",
  "approved",
  "scheduled",
  "completed",
  "no_show",
  "withdrawn",
] as const;

const FUNNEL_LABEL_KEYS: Record<(typeof FUNNEL_STEPS)[number], TranslationKey> = {
  qualified: "statusQualified",
  rejected: "statusRejected",
  approved: "statusApproved",
  scheduled: "statusScheduled",
  completed: "statusCompleted",
  no_show: "statusNoShowResearcher",
  withdrawn: "statusWithdrawnParticipant",
};

export default async function StudyAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { t } = await getLang();
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
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className={`text-sm ${mutedLinkClasses}`}>
          {t("backToStudies")}
        </Link>
        <h1 className="mt-2 font-serif-display text-2xl font-medium text-[var(--ink)]">
          {t("analyticsTitlePrefix")} {study.title}
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-sm text-[var(--ink)]/70">{t("totalApplicantsLabel")}</p>
            <p className="mt-1 font-serif-display text-3xl font-medium text-[var(--ink)]">
              {totalApplied}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-[var(--ink)]/70">{t("notAMatchRateLabel")}</p>
            <p className="mt-1 font-serif-display text-3xl font-medium text-[var(--ink)]">
              {totalApplied > 0 ? `${notMatchRate}%` : "—"}
            </p>
            <p className="mt-1 text-xs text-[var(--ink)]/60">
              {t("notAMatchRateHint")}
            </p>
          </Card>
          <Card className="sm:col-span-2">
            <p className="text-sm text-[var(--ink)]/70">{t("averageIncentivePaidLabel")}</p>
            <p className="mt-1 font-serif-display text-3xl font-medium text-[var(--ink)]">
              {averageIncentive !== null
                ? `NPR ${averageIncentive.toFixed(0)}`
                : "—"}
            </p>
            <p className="mt-1 text-xs text-[var(--ink)]/60">
              {t("averageIncentiveHintPrefix")} {receivedIncentives.length} {t("confirmedReceivedIncentiveSuffix")}.
            </p>
          </Card>
        </div>

        <Card className="mt-8">
          <h2 className="font-semibold text-[var(--ink)]">{t("applicantFunnelLabel")}</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {FUNNEL_STEPS.map((step) => (
              <div key={step} className="flex items-center justify-between">
                <dt className="text-[var(--ink)]/60">{t(FUNNEL_LABEL_KEYS[step])}</dt>
                <dd className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-[var(--mist)]/40">
                    <div
                      className="h-full rounded-full bg-[var(--coral)]"
                      style={{
                        width: `${totalApplied > 0 ? (counts[step] / totalApplied) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-medium text-[var(--ink)]">
                    {counts[step]}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}
