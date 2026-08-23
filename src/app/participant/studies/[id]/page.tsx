import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLang } from "@/lib/getLang";
import { LangToggle } from "@/app/LangToggle";
import { ApplyForm } from "./ApplyForm";

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
      "id, title, description, format, session_length_minutes, incentive_amount, district",
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
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/participant/studies" className="text-sm text-zinc-500 underline">
            {t("backToStudies")}
          </Link>
          <LangToggle />
        </div>

        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-zinc-900">
            {study.title}
          </h1>
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
            NPR {study.incentive_amount}
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-600">
          {formatLabels[study.format]}
          {study.district ? ` · ${study.district}` : ""} ·{" "}
          {study.session_length_minutes} {t("minutesSuffix")}
        </p>
        <p className="mt-4 text-zinc-700">{study.description}</p>

        {existingApplication ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5">
            <p className="font-medium text-zinc-900">{t("alreadyApplied")}</p>
            <p className="mt-1 text-sm text-zinc-600">
              {t("statusLabel")}: {applicationStatusLabels[existingApplication.status]}
            </p>
            <Link
              href="/participant/applications"
              className="mt-3 inline-block text-sm underline"
            >
              {t("viewApplications")}
            </Link>
          </div>
        ) : (
          <ApplyForm studyId={study.id} questions={orderedQuestions} />
        )}

        <Link
          href={`/report?studyId=${study.id}`}
          className="mt-8 inline-block text-sm text-zinc-400 underline hover:text-red-600"
        >
          {t("reportStudy")}
        </Link>
      </div>
    </div>
  );
}
