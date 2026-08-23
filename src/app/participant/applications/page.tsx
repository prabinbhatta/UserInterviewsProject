import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { confirmIncentiveReceived, reportIncentiveNotReceived } from "@/app/incentive-actions";
import { withdrawApplication } from "./actions";

const statusStyles: Record<string, string> = {
  qualified: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  approved: "bg-emerald-100 text-emerald-800",
  scheduled: "bg-purple-100 text-purple-800",
  completed: "bg-zinc-800 text-white",
  no_show: "bg-amber-100 text-amber-800",
  withdrawn: "bg-zinc-200 text-zinc-600",
};

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
  status: keyof typeof statusStyles;
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
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/participant" className="text-sm text-zinc-500 underline">
          Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Your applications
        </h1>

        {!applications || applications.length === 0 ? (
          <p className="mt-8 text-zinc-600">
            You haven&apos;t applied to any studies yet.{" "}
            <Link href="/participant/studies" className="underline">
              Browse open studies
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {applications.map((application) => (
              <li
                key={application.id}
                className="rounded-lg border border-zinc-200 bg-white p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-zinc-900">
                      {application.studies?.title}
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      NPR {application.studies?.incentive_amount}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {application.status !== "rejected" && (
                      <Link
                        href={`/participant/applications/${application.id}/messages`}
                        className="text-sm underline"
                      >
                        Message
                      </Link>
                    )}
                    {(application.status === "approved" ||
                      application.status === "scheduled") && (
                      <Link
                        href={`/participant/applications/${application.id}/schedule`}
                        className="text-sm underline"
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
                          className="text-sm text-zinc-400 underline hover:text-red-600"
                        >
                          Withdraw
                        </button>
                      </form>
                    )}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[application.status]}`}
                    >
                      {statusLabels[application.status]}
                    </span>
                  </div>
                </div>

                {application.status === "completed" &&
                  application.incentive_records && (
                    <div className="mt-3 border-t border-zinc-100 pt-3">
                      {application.incentive_records.status === "pending" && (
                        <p className="text-sm text-zinc-500">
                          The researcher hasn&apos;t sent your incentive yet.
                        </p>
                      )}

                      {application.incentive_records.status === "sent" && (
                        <div>
                          <p className="text-sm text-zinc-700">
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
                              <button
                                type="submit"
                                className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                              >
                                Yes, I received it
                              </button>
                            </form>
                            <form
                              action={reportIncentiveNotReceived.bind(
                                null,
                                application.id,
                                revalidateTarget,
                              )}
                            >
                              <button
                                type="submit"
                                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
                              >
                                No, I haven&apos;t
                              </button>
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
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
