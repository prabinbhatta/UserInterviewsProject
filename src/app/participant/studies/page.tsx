import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLang } from "@/lib/getLang";
import { LangToggle } from "@/app/LangToggle";
import { DISTRICTS } from "@/lib/districts";

type SearchParams = {
  format?: string;
  min_incentive?: string;
  max_incentive?: string;
  session_length?: string;
  district?: string;
};

export default async function BrowseStudiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const { t } = await getLang();
  const filters = await searchParams;

  const formatLabels: Record<string, string> = {
    online: t("formatOnline"),
    in_person: t("formatInPerson"),
    phone: t("formatPhone"),
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase
    .from("studies")
    .select(
      "id, title, description, format, session_length_minutes, incentive_amount, district",
    )
    .eq("status", "active");

  if (filters.format && ["online", "in_person", "phone"].includes(filters.format)) {
    query = query.eq("format", filters.format);
  }
  const minIncentive = Number(filters.min_incentive);
  if (filters.min_incentive && Number.isFinite(minIncentive)) {
    query = query.gte("incentive_amount", minIncentive);
  }
  const maxIncentive = Number(filters.max_incentive);
  if (filters.max_incentive && Number.isFinite(maxIncentive)) {
    query = query.lte("incentive_amount", maxIncentive);
  }
  if (filters.session_length === "30") {
    query = query.lte("session_length_minutes", 30);
  } else if (filters.session_length === "60") {
    query = query.lte("session_length_minutes", 60);
  } else if (filters.session_length === "60+") {
    query = query.gt("session_length_minutes", 60);
  }
  if (filters.district) {
    query = query.eq("district", filters.district);
  }

  const { data: studies } = await query.order("incentive_amount", {
    ascending: false,
  });

  const hasActiveFilters = Boolean(
    filters.format ||
      filters.min_incentive ||
      filters.max_incentive ||
      filters.session_length ||
      filters.district,
  );

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

        <form className="mt-6 grid grid-cols-2 gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:grid-cols-3">
          <label className="block text-xs font-medium text-zinc-600">
            {t("filterFormat")}
            <select
              name="format"
              defaultValue={filters.format ?? ""}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
            >
              <option value="">{t("filterAll")}</option>
              <option value="online">{t("formatOnline")}</option>
              <option value="in_person">{t("formatInPerson")}</option>
              <option value="phone">{t("formatPhone")}</option>
            </select>
          </label>

          <label className="block text-xs font-medium text-zinc-600">
            {t("filterSessionLength")}
            <select
              name="session_length"
              defaultValue={filters.session_length ?? ""}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
            >
              <option value="">{t("filterAnyLength")}</option>
              <option value="30">{t("filterUpTo30")}</option>
              <option value="60">{t("filterUpTo60")}</option>
              <option value="60+">{t("filterOver60")}</option>
            </select>
          </label>

          <label className="block text-xs font-medium text-zinc-600">
            {t("filterDistrict")}
            <select
              name="district"
              defaultValue={filters.district ?? ""}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
            >
              <option value="">{t("filterAnyDistrict")}</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-medium text-zinc-600">
            {t("filterMinIncentive")}
            <input
              type="number"
              name="min_incentive"
              min={0}
              defaultValue={filters.min_incentive ?? ""}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
            />
          </label>

          <label className="block text-xs font-medium text-zinc-600">
            {t("filterMaxIncentive")}
            <input
              type="number"
              name="max_incentive"
              min={0}
              defaultValue={filters.max_incentive ?? ""}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
            />
          </label>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="h-9 flex-1 rounded-full bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              {t("applyFilters")}
            </button>
          </div>

          {hasActiveFilters && (
            <div className="col-span-2 sm:col-span-3">
              <Link
                href="/participant/studies"
                className="text-xs text-zinc-500 underline"
              >
                {t("clearFilters")}
              </Link>
            </div>
          )}
        </form>

        {!studies || studies.length === 0 ? (
          <p className="mt-8 text-zinc-600">
            {hasActiveFilters ? t("noStudiesMatchFilters") : t("noOpenStudies")}
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
                        {formatLabels[study.format]}
                        {study.district ? ` · ${study.district}` : ""} ·{" "}
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
