import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLang } from "@/lib/getLang";
import { LangToggle } from "@/app/LangToggle";
import { DISTRICTS } from "@/lib/districts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fieldClasses } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/EmptyState";
import { mutedLinkClasses } from "@/components/ui/link";

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
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/participant" className={`text-sm ${mutedLinkClasses}`}>
            {t("backToDashboard")}
          </Link>
          <LangToggle />
        </div>
        <h1 className="mt-2 font-serif-display text-3xl font-medium text-[var(--ink)]">
          {t("openStudies")}
        </h1>

        <Card as="form" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <label className="block text-xs font-medium text-[var(--ink)]/60">
            {t("filterFormat")}
            <select
              name="format"
              defaultValue={filters.format ?? ""}
              className={`${fieldClasses} py-1.5 text-sm`}
            >
              <option value="">{t("filterAll")}</option>
              <option value="online">{t("formatOnline")}</option>
              <option value="in_person">{t("formatInPerson")}</option>
              <option value="phone">{t("formatPhone")}</option>
            </select>
          </label>

          <label className="block text-xs font-medium text-[var(--ink)]/60">
            {t("filterSessionLength")}
            <select
              name="session_length"
              defaultValue={filters.session_length ?? ""}
              className={`${fieldClasses} py-1.5 text-sm`}
            >
              <option value="">{t("filterAnyLength")}</option>
              <option value="30">{t("filterUpTo30")}</option>
              <option value="60">{t("filterUpTo60")}</option>
              <option value="60+">{t("filterOver60")}</option>
            </select>
          </label>

          <label className="block text-xs font-medium text-[var(--ink)]/60">
            {t("filterDistrict")}
            <select
              name="district"
              defaultValue={filters.district ?? ""}
              className={`${fieldClasses} py-1.5 text-sm`}
            >
              <option value="">{t("filterAnyDistrict")}</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-medium text-[var(--ink)]/60">
            {t("filterMinIncentive")}
            <input
              type="number"
              name="min_incentive"
              min={0}
              defaultValue={filters.min_incentive ?? ""}
              className={`${fieldClasses} py-1.5 text-sm`}
            />
          </label>

          <label className="block text-xs font-medium text-[var(--ink)]/60">
            {t("filterMaxIncentive")}
            <input
              type="number"
              name="max_incentive"
              min={0}
              defaultValue={filters.max_incentive ?? ""}
              className={`${fieldClasses} py-1.5 text-sm`}
            />
          </label>

          <div className="flex items-end gap-2">
            <Button type="submit" size="sm" className="flex-1">
              {t("applyFilters")}
            </Button>
          </div>

          {hasActiveFilters && (
            <div className="col-span-2 sm:col-span-3">
              <Link href="/participant/studies" className={`text-xs ${mutedLinkClasses}`}>
                {t("clearFilters")}
              </Link>
            </div>
          )}
        </Card>

        {!studies || studies.length === 0 ? (
          <EmptyState
            title={t("emptyStudiesTitle")}
            body={hasActiveFilters ? t("noStudiesMatchFilters") : t("noOpenStudies")}
          />
        ) : (
          <ul className="mt-8 space-y-4">
            {studies.map((study) => (
              <li key={study.id}>
                <Link href={`/participant/studies/${study.id}`} className="block">
                  <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--coral)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-[var(--ink)]">
                          {study.title}
                        </h2>
                        <p className="mt-1 text-sm text-[var(--ink)]/60">
                          {formatLabels[study.format]}
                          {study.district ? ` · ${study.district}` : ""} ·{" "}
                          {study.session_length_minutes} {t("minutesSuffix")}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-[var(--ink)]/60">
                          {study.description}
                        </p>
                      </div>
                      <Badge tone="success" className="shrink-0">
                        NPR {study.incentive_amount}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
