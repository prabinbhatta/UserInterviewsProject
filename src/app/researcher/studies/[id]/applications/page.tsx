import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { approveApplication, rejectApplication } from "./actions";
import { markSessionCompleted, markNoShow, sendIncentive } from "@/app/incentive-actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mutedLinkClasses } from "@/components/ui/link";
import { applicationStatusTones, incentiveStatusTones } from "@/lib/applicationStatus";

const statusLabels: Record<string, string> = {
  qualified: "Qualified — pending review",
  rejected: "Not a match",
  approved: "Approved",
  scheduled: "Scheduled",
  completed: "Session completed",
  no_show: "No-show",
  withdrawn: "Withdrawn by participant",
};

const incentiveLabels: Record<string, string> = {
  pending: "Incentive not sent yet",
  sent: "Incentive sent — awaiting confirmation",
  received: "Incentive confirmed received",
  not_received: "Participant reports incentive not received",
};

type ApplicationRow = {
  id: string;
  status: keyof typeof applicationStatusTones;
  created_at: string;
  profiles: { full_name: string | null } | null;
  incentive_records: { status: keyof typeof incentiveStatusTones; amount: number } | null;
};

export default async function StudyApplicationsPage({
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

  const { data: applications } = (await supabase
    .from("applications")
    .select(
      "id, status, created_at, profiles(full_name), incentive_records(status, amount)",
    )
    .eq("study_id", id)
    .order("created_at", { ascending: true })) as {
    data: ApplicationRow[] | null;
  };

  const revalidateTarget = `/researcher/studies/${id}/applications`;
  const boundApprove = approveApplication.bind(null, id);
  const boundReject = rejectApplication.bind(null, id);

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/researcher/studies" className={`text-sm ${mutedLinkClasses}`}>
            Back to studies
          </Link>
          <a
            href={`/researcher/studies/${id}/applications/export`}
            className={`text-sm ${mutedLinkClasses}`}
          >
            Export CSV
          </a>
        </div>
        <h1 className="mt-2 font-serif-display text-2xl font-medium text-[var(--ink)]">
          Applicants — {study.title}
        </h1>

        {!applications || applications.length === 0 ? (
          <p className="mt-8 text-[var(--ink)]/70">
            No one has applied yet — check back once the study is published
            and shared.
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {applications.map((application) => (
              <Card
                as="li"
                key={application.id}
                className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-[var(--ink)]">
                    {application.profiles?.full_name ?? "Participant"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge tone={applicationStatusTones[application.status]}>
                      {statusLabels[application.status]}
                    </Badge>
                    {application.status === "completed" &&
                      application.incentive_records && (
                        <Badge tone={incentiveStatusTones[application.incentive_records.status]}>
                          {incentiveLabels[application.incentive_records.status]}
                        </Badge>
                      )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    href={`/researcher/studies/${id}/applications/${application.id}/messages`}
                    className={`text-sm ${mutedLinkClasses}`}
                  >
                    Message
                  </Link>
                  {application.status === "qualified" && (
                    <>
                      <form action={boundApprove.bind(null, application.id)}>
                        <Button type="submit" size="sm">
                          Approve
                        </Button>
                      </form>
                      <form action={boundReject.bind(null, application.id)}>
                        <Button type="submit" size="sm" variant="secondary">
                          Not a fit
                        </Button>
                      </form>
                    </>
                  )}
                  {application.status === "scheduled" && (
                    <>
                      <form
                        action={markSessionCompleted.bind(
                          null,
                          application.id,
                          revalidateTarget,
                        )}
                      >
                        <Button type="submit" size="sm">
                          Mark session completed
                        </Button>
                      </form>
                      <form
                        action={markNoShow.bind(
                          null,
                          application.id,
                          revalidateTarget,
                        )}
                      >
                        <Button type="submit" size="sm" variant="secondary">
                          Didn&apos;t show up
                        </Button>
                      </form>
                    </>
                  )}
                  {application.status === "completed" &&
                    application.incentive_records?.status === "pending" && (
                      <form
                        action={sendIncentive.bind(
                          null,
                          application.id,
                          revalidateTarget,
                        )}
                      >
                        <Button type="submit" size="sm">
                          I&apos;ve sent the incentive
                        </Button>
                      </form>
                    )}
                </div>
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
