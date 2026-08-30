import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLang } from "@/lib/getLang";
import { LangToggle } from "@/app/LangToggle";
import { ApplyForm } from "./ApplyForm";
import { joinWaitlist, leaveWaitlist } from "./waitlist-actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mutedLinkClasses } from "@/components/ui/link";

export default async function StudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getLang();

  const formatLabels: Record<string, string> = {
    online: t("formatOnline"),
    in_person: t("formatInPerson"),
    phone: t("formatPhone"),
  };

  const applicationStatusLabels: Record<string, string> = {
    qualified: t("statusQualified"),
    rejected: t("statusRejected"),
    approved: t("statusApproved"),
    scheduled: t("statusScheduled"),
    completed: t("statusCompleted"),
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: study } = await supabase
    .from("studies")
    .select(
      "id, title, description, format, session_length_minutes, incentive_amount, district, status",
    )
    .eq("id", id)
    .single();

  if (!study) {
    notFound();
  }

  const { data: existingApplication } = await supabase
    .from("applications")
    .select("id, status")
    .eq("study_id", id)
    .eq("participant_id", user.id)
    .maybeSingle();

  const { data: waitlistEntry } = await supabase
    .from("study_waitlist")
    .select("id")
    .eq("study_id", id)
    .eq("participant_id", user.id)
    .maybeSingle();

  const boundJoinWaitlist = joinWaitlist.bind(null, id);
  const boundLeaveWaitlist = leaveWaitlist.bind(null, id);

  const { data: questions } = await supabase
    .from("screener_questions")
    .select(
      "id, question_text, type, required, created_at, screener_options(id, label, sort_order)",
    )
    .eq("study_id", id)
    .order("created_at", { ascending: true });

  const orderedQuestions = (questions ?? []).map((q) => ({
    ...q,
    screener_options: [...(q.screener_options ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
  }));

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/participant/studies" className={`text-sm ${mutedLinkClasses}`}>
            {t("backToStudies")}
          </Link>
          <LangToggle />
        </div>

        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="font-display text-2xl font-medium text-[var(--ink)]">
            {study.title}
          </h1>
          <Badge tone="success" className="shrink-0">
            NPR {study.incentive_amount}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          {formatLabels[study.format]}
          {study.district ? ` · ${study.district}` : ""} ·{" "}
          {study.session_length_minutes} {t("minutesSuffix")}
        </p>
        <p className="mt-4 text-[var(--ink)]/80">{study.description}</p>

        {existingApplication ? (
          <Card className="mt-8">
            <p className="font-medium text-[var(--ink)]">{t("alreadyApplied")}</p>
            <p className="mt-1 text-sm text-[var(--ink)]/60">
              {t("statusLabel")}: {applicationStatusLabels[existingApplication.status]}
            </p>
            <Link
              href="/participant/applications"
              className={`mt-3 inline-block text-sm ${mutedLinkClasses}`}
            >
              {t("viewApplications")}
            </Link>
          </Card>
        ) : study.status === "closed" ? (
          <Card className="mt-8">
            {waitlistEntry ? (
              <>
                <p className="font-medium text-[var(--ink)]">{t("onWaitlistTitle")}</p>
                <p className="mt-1 text-sm text-[var(--ink)]/60">{t("onWaitlistBody")}</p>
                <form action={boundLeaveWaitlist} className="mt-3">
                  <button type="submit" className={`text-sm ${mutedLinkClasses}`}>
                    {t("leaveWaitlistAction")}
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="font-medium text-[var(--ink)]">{t("studyFullTitle")}</p>
                <p className="mt-1 text-sm text-[var(--ink)]/60">{t("studyFullBody")}</p>
                <form action={boundJoinWaitlist} className="mt-3">
                  <Button type="submit" size="sm">
                    {t("joinWaitlistAction")}
                  </Button>
                </form>
              </>
            )}
          </Card>
        ) : (
          <ApplyForm studyId={study.id} questions={orderedQuestions} />
        )}

        <Link
          href={`/report?studyId=${study.id}`}
          className="mt-8 inline-block text-sm text-[var(--ink)]/60 underline decoration-[var(--line)] underline-offset-4 hover:text-[#a8371c]"
        >
          {t("reportStudy")}
        </Link>
      </div>
    </div>
  );
}
