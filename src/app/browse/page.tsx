import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLang } from "@/lib/getLang";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { mutedLinkClasses } from "@/components/ui/link";

const TITLE = "Open Studies — PanelMeet";
const DESCRIPTION =
  "Browse paid research studies open to participants in Nepal right now — online, in-person, and phone sessions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default async function PublicBrowsePage() {
  const supabase = await createClient();
  const { t } = await getLang();

  const formatLabels: Record<string, string> = {
    online: t("formatOnline"),
    in_person: t("formatInPerson"),
    phone: t("formatPhone"),
  };

  const { data: studies } = await supabase
    .from("studies")
    .select("id, title, description, format, session_length_minutes, incentive_amount, district")
    .eq("status", "active")
    .order("incentive_amount", { ascending: false });

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-2xl">
        <Link href="/" className={`text-sm ${mutedLinkClasses}`}>
          {t("backToDashboard")}
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium text-[var(--ink)]">
          {t("openStudies")}
        </h1>
        <p className="mt-1 text-[var(--ink)]/70">
          Real, paid research studies open right now. Sign up to apply.
        </p>

        {!studies || studies.length === 0 ? (
          <EmptyState title={t("emptyStudiesTitle")} body={t("noOpenStudies")} />
        ) : (
          <ul className="mt-8 space-y-4">
            {studies.map((study) => (
              <li key={study.id}>
                <Link href={`/browse/${study.id}`} className="block">
                  <Card className="transition-all duration-200 ease-interact hover:-translate-y-0.5 hover:border-[var(--accent)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-[var(--ink)]">{study.title}</h2>
                        <p className="mt-1 text-sm text-[var(--ink)]/60">
                          {formatLabels[study.format]}
                          {study.district ? ` · ${study.district}` : ""} ·{" "}
                          {study.session_length_minutes} {t("minutesSuffix")}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-[var(--ink)]/60">
                          {study.description}
                        </p>
                      </div>
                      <Badge tone="success" className="shrink-0">
                        NPR {study.incentive_amount}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex justify-center">
          <LinkButton href="/signup?role=participant" variant="primary">
            {t("ctaParticipant")}
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
