import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { confirmIncentiveReceived, reportIncentiveNotReceived } from "@/app/incentive-actions";
import { withdrawApplication } from "./actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mutedLinkClasses } from "@/components/ui/link";
import { applicationStatusTones as statusTones } from "@/lib/applicationStatus";

const statusLabels: Record<string, string> = {
  qualified: "Qualified — pending review",
  rejected: "Not a match",
  approved: "Approved",
  scheduled: "Scheduled",
  completed: "Session completed",
  no_show: "Marked as a missed session",
  withdrawn: "Withdrawn",
};

type ApplicationRow = {
  id: string;
  status: keyof typeof statusTones;
  created_at: string;
  studies: { id: string; title: string; incentive_amount: number } | null;
  incentive_records: {
    status: "pending" | "sent" | "received" | "not_received";
    amount: number;
  } | null;
};

export default async function MyApplicationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: applications } = (await supabase
    .from("applications")
    .select(
      "id, status, created_at, studies(id, title, incentive_amount), incentive_records(status, amount)",
    )
    .eq("participant_id", user.id)
    .order("created_at", { ascending: false })) as {
    data: ApplicationRow[] | null;
  };

  const revalidateTarget = "/participant/applications";

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/participant" className={`text-sm ${mutedLinkClasses}`}>
          Back to dashboard
        </Link>
        <h1 className="mt-2 font-serif-display text-3xl font-medium text-[var(--ink)]">
          Your applications
        </h1>

        {!applications || applications.length === 0 ? (
          <p className="mt-8 text-[var(--ink)]/70">
            You haven&apos;t applied to any studies yet.{" "}
            <Link href="/participant/studies" className={mutedLinkClasses}>
              Browse open studies
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {applications.map((application) => (
              <Card as="li" key={application.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-[var(--ink)]">
                      {application.studies?.title}
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--ink)]/70">
                      NPR {application.studies?.incentive_amount}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {application.status !== "rejected" && (
                      <Link
                        href={`/participant/applications/${application.id}/messages`}
                        className={`text-sm ${mutedLinkClasses}`}
                      >
                        Message
                      </Link>
                    )}
                    {(application.status === "approved" ||
                      application.status === "scheduled") && (
                      <Link
                        href={`/participant/applications/${application.id}/schedule`}
                        className={`text-sm ${mutedLinkClasses}`}
                      >
                        {application.status === "scheduled"
                          ? "View time"
                          : "Pick a time"}
                      </Link>
                    )}
                    {(application.status === "qualified" ||
                      application.status === "approved") && (
                      <form
                        action={withdrawApplication.bind(null, application.id)}
                      >
                        <button
                          type="submit"
                          className={`text-sm ${mutedLinkClasses}`}
                        >
                          Withdraw
                        </button>
                      </form>
                    )}
                    <Badge tone={statusTones[application.status]}>
                      {statusLabels[application.status]}
                    </Badge>
                  </div>
                </div>

                {application.status === "completed" &&
                  application.incentive_records && (
                    <div className="mt-3 border-t border-[var(--mist)]/50 pt-3">
                      {application.incentive_records.status === "pending" && (
                        <p className="text-sm text-[var(--ink)]/70">
                          The researcher hasn&apos;t sent your incentive yet.
                        </p>
                      )}

                      {application.incentive_records.status === "sent" && (
                        <div>
                          <p className="text-sm text-[var(--ink)]/80">
                            The researcher marked your NPR{" "}
                            {application.incentive_records.amount} incentive
                            as sent. Have you received it?
                          </p>
                          <div className="mt-2 flex gap-2">
                            <form
                              action={confirmIncentiveReceived.bind(
                                null,
                                application.id,
                                revalidateTarget,
                              )}
                            >
                              <Button type="submit" size="sm">
                                Yes, I received it
                              </Button>
                            </form>
                            <form
                              action={reportIncentiveNotReceived.bind(
                                null,
                                application.id,
                                revalidateTarget,
                              )}
                            >
                              <Button type="submit" size="sm" variant="secondary">
                                No, I haven&apos;t
                              </Button>
                            </form>
                          </div>
                        </div>
                      )}

                      {application.incentive_records.status === "received" && (
                        <p className="text-sm text-emerald-700">
                          You confirmed this incentive as received. Thanks!
                        </p>
                      )}

                      {application.incentive_records.status ===
                        "not_received" && (
                        <div className="rounded-lg bg-[var(--coral)]/10 p-3 text-sm text-[#a8371c]">
                          <p className="font-medium">
                            You reported this incentive as not received.
                          </p>
                          <p className="mt-1">
                            We&apos;ve flagged it for follow-up. If it&apos;s
                            not resolved soon, contact support at{" "}
                            <span className="font-medium">
                              +977-9715633635
                            </span>
                            .
                          </p>
                        </div>
                      )}
                    </div>
                  )}
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
