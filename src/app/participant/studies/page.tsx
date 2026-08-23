import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const formatLabels: Record<string, string> = {
  online: "Online",
  in_person: "In person",
  phone: "Phone",
};

export default async function BrowseStudiesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: studies } = await supabase
    .from("studies")
    .select(
      "id, title, description, format, session_length_minutes, incentive_amount",
    )
    .eq("status", "active")
    .order("incentive_amount", { ascending: false });

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-2xl">
        <Link href="/participant" className="text-sm text-zinc-500 underline">
          Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Open studies
        </h1>

        {!studies || studies.length === 0 ? (
          <p className="mt-8 text-zinc-600">
            No open studies right now — check back soon.
          </p>
        ) : (
          <ul className="mt-8 space-y-4">
            {studies.map((study) => (
              <li key={study.id}>
                <Link
                  href={`/participant/studies/${study.id}`}
                  className="block rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-400"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-zinc-900">
                        {study.title}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-600">
                        {formatLabels[study.format]} ·{" "}
                        {study.session_length_minutes} min
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                        {study.description}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      NPR {study.incentive_amount}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
