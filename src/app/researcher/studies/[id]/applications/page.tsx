import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { approveApplication, rejectApplication } from "./actions";
import { markSessionCompleted, markNoShow, sendIncentive } from "@/app/incentive-actions";

const statusStyles: Record<string, string> = {
  qualified: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  approved: "bg-emerald-100 text-emerald-800",
  scheduled: "bg-purple-100 text-purple-800",
  completed: "bg-zinc-800 text-white",
  no_show: "bg-amber-100 text-amber-800",
};

const statusLabels: Record<string, string> = {
  qualified: "Qualified — pending review",
  rejected: "Not a match",
  approved: "Approved",
  scheduled: "Scheduled",
  completed: "Session completed",
  no_show: "No-show",
};

const incentiveStyles: Record<string, string> = {
  pending: "bg-zinc-200 text-zinc-700",
  sent: "bg-amber-100 text-amber-800",
  received: "bg-emerald-100 text-emerald-800",
  not_received: "bg-red-100 text-red-800",
};

const incentiveLabels: Record<string, string> = {
  pending: "Incentive not sent yet",
  sent: "Incentive sent — awaiting confirmation",
  received: "Incentive confirmed received",
  not_received: "Participant reports incentive not received",
};

type ApplicationRow = {
  id: string;
  status: keyof typeof statusStyles;
  created_at: string;
  profiles: { full_name: string | null } | null;
  incentive_records: { status: keyof typeof incentiveStyles; amount: number } | null;
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
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className="text-sm text-zinc-500 underline">
          Back to studies
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Applicants — {study.title}
        </h1>

        {!applications || applications.length === 0 ? (
          <p className="mt-8 text-zinc-600">
            No one has applied yet — check back once the study is published
            and shared.
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {applications.map((application) => (
              <li
                key={application.id}
                className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900">
                    {application.profiles?.full_name ?? "Participant"}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[application.status]}`}
                  >
                    {statusLabels[application.status]}
                  </span>
                  {application.status === "completed" &&
                    application.incentive_records && (
                      <span
                        className={`mt-1 ml-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${incentiveStyles[application.incentive_records.status]}`}
                      >
                        {incentiveLabels[application.incentive_records.status]}
                      </span>
                    )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    href={`/researcher/studies/${id}/applications/${application.id}/messages`}
                    className="text-sm text-zinc-500 underline"
                  >
                    Message
                  </Link>
                  {application.status === "qualified" && (
                    <>
                      <form action={boundApprove.bind(null, application.id)}>
                        <button
                          type="submit"
                          className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={boundReject.bind(null, application.id)}>
                        <button
                          type="submit"
                          className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
                        >
                          Not a fit
                        </button>
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
                        <button
                          type="submit"
                          className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                        >
                          Mark session completed
                        </button>
                      </form>
                      <form
                        action={markNoShow.bind(
                          null,
                          application.id,
                          revalidateTarget,
                        )}
                      >
                        <button
                          type="submit"
                          className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
                        >
                          Didn&apos;t show up
                        </button>
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
                        <button
                          type="submit"
                          className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                        >
                          I&apos;ve sent the incentive
                        </button>
                      </form>
                    )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
