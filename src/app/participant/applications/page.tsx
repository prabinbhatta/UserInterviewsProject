import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  qualified: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  approved: "bg-emerald-100 text-emerald-800",
  scheduled: "bg-purple-100 text-purple-800",
  completed: "bg-zinc-800 text-white",
};

const statusLabels: Record<string, string> = {
  qualified: "Qualified — pending review",
  rejected: "Not a match",
  approved: "Approved",
  scheduled: "Scheduled",
  completed: "Completed",
};

type ApplicationRow = {
  id: string;
  status: keyof typeof statusStyles;
  created_at: string;
  studies: { id: string; title: string; incentive_amount: number } | null;
};

export default async function MyApplicationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: applications } = (await supabase
    .from("applications")
    .select("id, status, created_at, studies(id, title, incentive_amount)")
    .eq("participant_id", user.id)
    .order("created_at", { ascending: false })) as {
    data: ApplicationRow[] | null;
  };

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
                className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-zinc-900">
                    {application.studies?.title}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    NPR {application.studies?.incentive_amount}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[application.status]}`}
                >
                  {statusLabels[application.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
