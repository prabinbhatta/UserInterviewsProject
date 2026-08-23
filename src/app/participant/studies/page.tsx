import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLang } from "@/lib/getLang";
import { LangToggle } from "@/app/LangToggle";

export default async function BrowseStudiesPage() {
  const supabase = await createClient();
  const { t } = await getLang();

  const formatLabels: Record<string, string> = {
    online: t("formatOnline"),
    in_person: t("formatInPerson"),
    phone: t("formatPhone"),
  };

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
        <div className="flex items-center justify-between gap-4">
          <Link href="/participant" className="text-sm text-zinc-500 underline">
            {t("backToDashboard")}
          </Link>
          <LangToggle />
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          {t("openStudies")}
        </h1>

        {!studies || studies.length === 0 ? (
          <p className="mt-8 text-zinc-600">{t("noOpenStudies")}</p>
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
                        {study.session_length_minutes} {t("minutesSuffix")}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                        {study.description}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
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
