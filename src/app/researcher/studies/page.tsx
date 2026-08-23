import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publishStudy, closeStudy } from "./actions";

const statusStyles: Record<string, string> = {
  draft: "bg-zinc-200 text-zinc-700",
  active: "bg-green-100 text-green-800",
  closed: "bg-zinc-800 text-white",
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
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/researcher" className="text-sm text-zinc-500 underline">
              Back to dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
              Your studies
            </h1>
          </div>
          <Link
            href="/researcher/studies/new"
            className="flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            New study
          </Link>
        </div>

        {!studies || studies.length === 0 ? (
          <p className="mt-8 text-zinc-600">
            You haven&apos;t created a study yet.
          </p>
        ) : (
          <ul className="mt-8 space-y-4">
            {studies.map((study) => (
              <li
                key={study.id}
                className="rounded-lg border border-zinc-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-zinc-900">
                        {study.title}
                      </h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[study.status]}`}
                      >
                        {study.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">
                      {formatLabels[study.format]} · {study.session_length_minutes} min ·{" "}
                      {study.participants_needed} participants · NPR{" "}
                      {study.incentive_amount}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Link
                      href={`/researcher/studies/${study.id}/screener`}
                      className="text-sm text-zinc-500 underline"
                    >
                      Screener
                    </Link>
                    {study.status === "draft" && (
                      <>
                        <Link
                          href={`/researcher/studies/${study.id}/edit`}
                          className="text-sm text-zinc-500 underline"
                        >
                          Edit
                        </Link>
                        <form action={publishStudy.bind(null, study.id)}>
                          <button
                            type="submit"
                            className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                          >
                            Publish
                          </button>
                        </form>
                      </>
                    )}
                    {study.status === "active" && (
                      <form action={closeStudy.bind(null, study.id)}>
                        <button
                          type="submit"
                          className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
                        >
                          Close
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
