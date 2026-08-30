import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publishStudy, closeStudy, duplicateStudy } from "./actions";
import { getLang } from "@/lib/getLang";
import type { TranslationKey } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { mutedLinkClasses } from "@/components/ui/link";
import { EmptyState } from "@/components/ui/EmptyState";

const statusTones: Record<string, BadgeTone> = {
  draft: "neutral",
  active: "success",
  closed: "strong",
};

const statusLabelKeys: Record<string, TranslationKey> = {
  draft: "studyStatusDraft",
  active: "studyStatusActive",
  closed: "studyStatusClosed",
};

const formatLabelKeys: Record<string, TranslationKey> = {
  online: "formatOnline",
  in_person: "formatInPerson",
  phone: "formatPhone",
};

const navPillClasses =
  "rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-medium text-[var(--ink)]/70 transition-colors duration-150 ease-interact hover:border-[var(--accent)] hover:text-[var(--accent)]";

export default async function StudiesPage() {
  const { t } = await getLang();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: studies } = await supabase
    .from("studies")
    .select(
      "id, title, format, session_length_minutes, participants_needed, incentive_amount, status",
    )
    .eq("researcher_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/researcher" className={`text-sm ${mutedLinkClasses}`}>
              {t("backToDashboard")}
            </Link>
            <h1 className="mt-2 font-display text-3xl font-medium text-[var(--ink)]">
              {t("yourStudies")}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/researcher/participants"
              className={`text-sm ${mutedLinkClasses}`}
            >
              Search participants
            </Link>
            <LinkButton href="/researcher/studies/new" size="sm">
              {t("newStudy")}
            </LinkButton>
          </div>
        </div>

        {!studies || studies.length === 0 ? (
          <EmptyState
            title={t("emptyResearcherStudiesTitle")}
            body={t("noStudiesYet")}
            action={
              <LinkButton href="/researcher/studies/new" variant="primary" size="sm">
                {t("newStudy")}
              </LinkButton>
            }
          />
        ) : (
          <ul className="mt-8 space-y-4">
            {studies.map((study) => (
              <Card as="li" key={study.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-[var(--ink)]">
                        {study.title}
                      </h2>
                      <Badge tone={statusTones[study.status]}>
                        {t(statusLabelKeys[study.status])}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--ink)]/60">
                      {t(formatLabelKeys[study.format])} · {study.session_length_minutes} {t("minutesSuffix")} ·{" "}
                      {study.participants_needed} {t("participantsSuffix")} · NPR{" "}
                      {study.incentive_amount}
                    </p>
                  </div>

                  {study.status === "draft" && (
                    <form action={publishStudy.bind(null, study.id)} className="shrink-0">
                      <Button type="submit" size="sm">
                        {t("publishAction")}
                      </Button>
                    </form>
                  )}
                  {study.status === "active" && (
                    <form action={closeStudy.bind(null, study.id)} className="shrink-0">
                      <Button type="submit" size="sm" variant="secondary">
                        {t("closeAction")}
                      </Button>
                    </form>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--line)]/60 pt-4">
                  <Link
                    href={`/researcher/studies/${study.id}/applications`}
                    className={navPillClasses}
                  >
                    {t("applicantsNav")}
                  </Link>
                  <Link
                    href={`/researcher/studies/${study.id}/invite`}
                    className={navPillClasses}
                  >
                    {t("inviteNav")}
                  </Link>
                  <Link
                    href={`/researcher/studies/${study.id}/slots`}
                    className={navPillClasses}
                  >
                    {t("timeSlotsNav")}
                  </Link>
                  <Link
                    href={`/researcher/studies/${study.id}/screener`}
                    className={navPillClasses}
                  >
                    {t("screenerNav")}
                  </Link>
                  <Link
                    href={`/researcher/studies/${study.id}/analytics`}
                    className={navPillClasses}
                  >
                    {t("analyticsNav")}
                  </Link>
                  {study.status === "draft" && (
                    <Link
                      href={`/researcher/studies/${study.id}/edit`}
                      className={navPillClasses}
                    >
                      {t("editNav")}
                    </Link>
                  )}
                </div>

                <div className="mt-2">
                  <form action={duplicateStudy.bind(null, study.id)}>
                    <button type="submit" className={`text-xs ${mutedLinkClasses}`}>
                      {t("duplicateAction")}
                    </button>
                  </form>
                </div>
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
