import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLang } from "@/lib/getLang";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { mutedLinkClasses } from "@/components/ui/link";

async function getStudy(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("studies")
    .select(
      "id, title, description, format, session_length_minutes, incentive_amount, district, status",
    )
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const study = await getStudy(id);
  if (!study) return { title: "Study not found — Nepal User Research" };

  const title = `${study.title} — Nepal User Research`;
  const description = study.description.slice(0, 160);
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicStudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { t } = await getLang();
  const study = await getStudy(id);
  if (!study) notFound();

  const formatLabels: Record<string, string> = {
    online: t("formatOnline"),
    in_person: t("formatInPerson"),
    phone: t("formatPhone"),
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/browse" className={`text-sm ${mutedLinkClasses}`}>
          {t("backToStudies")}
        </Link>

        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="font-serif-display text-2xl font-medium text-[var(--ink)]">
            {study.title}
          </h1>
          <Badge tone="success" className="shrink-0">
            NPR {study.incentive_amount}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          {formatLabels[study.format]}
          {study.district ? ` · ${study.district}` : ""} · {study.session_length_minutes}{" "}
          {t("minutesSuffix")}
        </p>
        <p className="mt-4 text-[var(--ink)]/80">{study.description}</p>

        <Card className="mt-8">
          <p className="font-medium text-[var(--ink)]">
            Create a free account to apply
          </p>
          <p className="mt-1 text-sm text-[var(--ink)]/60">
            Sign up, answer a couple of quick questions, and we&apos;ll let you know if
            you&apos;re a match.
          </p>
          <LinkButton
            href="/signup?role=participant"
            variant="primary"
            className="mt-4 w-full"
          >
            {t("ctaParticipant")}
          </LinkButton>
        </Card>
      </div>
    </div>
  );
}
