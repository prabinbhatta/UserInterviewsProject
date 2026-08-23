import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publishStudy, closeStudy, duplicateStudy } from "./actions";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { mutedLinkClasses } from "@/components/ui/link";

const statusTones: Record<string, BadgeTone> = {
  draft: "neutral",
  active: "success",
  closed: "strong",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  closed: "Closed",
};

const formatLabels: Record<string, string> = {
  online: "Online",
  in_person: "In person",
  phone: "Phone",
};

export default async function StudiesPage() {
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
              Back to dashboard
            </Link>
            <h1 className="mt-2 font-serif-display text-3xl font-medium text-[var(--ink)]">
              Your studies
            </h1>
          </div>
          <LinkButton href="/researcher/studies/new" size="sm">
            New study
          </LinkButton>
        </div>

        {!studies || studies.length === 0 ? (
          <p className="mt-8 text-[var(--ink)]/70">
            You haven&apos;t created a study yet.
          </p>
        ) : (
          <ul className="mt-8 space-y-4">
            {studies.map((study) => (
              <Card as="li" key={study.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-[var(--ink)]">
                        {study.title}
                      </h2>
                      <Badge tone={statusTones[study.status]}>
                        {statusLabels[study.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--ink)]/60">
                      {formatLabels[study.format]} · {study.session_length_minutes} min ·{" "}
                      {study.participants_needed} participants · NPR{" "}
                      {study.incentive_amount}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Link
                      href={`/researcher/studies/${study.id}/applications`}
                      className={`text-sm ${mutedLinkClasses}`}
                    >
                      Applicants
                    </Link>
                    <Link
                      href={`/researcher/studies/${study.id}/invite`}
                      className={`text-sm ${mutedLinkClasses}`}
                    >
                      Invite
                    </Link>
                    <Link
                      href={`/researcher/studies/${study.id}/slots`}
                      className={`text-sm ${mutedLinkClasses}`}
                    >
                      Time slots
                    </Link>
                    <Link
                      href={`/researcher/studies/${study.id}/screener`}
                      className={`text-sm ${mutedLinkClasses}`}
                    >
                      Screener
                    </Link>
                    <Link
                      href={`/researcher/studies/${study.id}/analytics`}
                      className={`text-sm ${mutedLinkClasses}`}
                    >
                      Analytics
                    </Link>
                    {study.status === "draft" && (
                      <>
                        <Link
                          href={`/researcher/studies/${study.id}/edit`}
                          className={`text-sm ${mutedLinkClasses}`}
                        >
                          Edit
                        </Link>
                        <form action={publishStudy.bind(null, study.id)}>
                          <Button type="submit" size="sm">
                            Publish
                          </Button>
                        </form>
                      </>
                    )}
                    {study.status === "active" && (
                      <form action={closeStudy.bind(null, study.id)}>
                        <Button type="submit" size="sm" variant="secondary">
                          Close
                        </Button>
                      </form>
                    )}
                    <form action={duplicateStudy.bind(null, study.id)}>
                      <button type="submit" className={`text-sm ${mutedLinkClasses}`}>
                        Duplicate
                      </button>
                    </form>
                  </div>
                </div>
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
