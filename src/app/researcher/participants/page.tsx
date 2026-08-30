import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DISTRICTS } from "@/lib/districts";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fieldClasses } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/EmptyState";
import { mutedLinkClasses } from "@/components/ui/link";
import { InviteButton } from "./InviteButton";

type SearchParams = {
  study_id?: string;
  district?: string;
  min_age?: string;
  max_age?: string;
  device?: string;
  language?: string;
};

const DEVICES = ["Computer with webcam", "Tablet", "Smartphone"];
const LANGUAGES = ["Nepali", "English", "Other"];

export default async function ParticipantSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const filters = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "researcher") redirect("/participant");

  const { data: myStudies } = await supabase
    .from("studies")
    .select("id, title")
    .eq("researcher_id", user.id)
    .in("status", ["draft", "active"])
    .order("created_at", { ascending: false });

  const minAge = filters.min_age ? Number(filters.min_age) : null;
  const maxAge = filters.max_age ? Number(filters.max_age) : null;

  type ParticipantResult = {
    id: string;
    full_name: string | null;
    district: string | null;
    age: number | null;
    occupation: string | null;
    languages: string[] | null;
    devices: string[] | null;
  };

  const { data: results } = (await supabase.rpc("search_participants", {
    p_district: filters.district || null,
    p_min_age: Number.isFinite(minAge) ? minAge : null,
    p_max_age: Number.isFinite(maxAge) ? maxAge : null,
    p_device: filters.device || null,
    p_language: filters.language || null,
    p_limit: 50,
  })) as { data: ParticipantResult[] | null };

  const hasActiveFilters = Boolean(
    filters.district || filters.min_age || filters.max_age || filters.device || filters.language,
  );

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-2xl">
        <Link href="/researcher/studies" className={`text-sm ${mutedLinkClasses}`}>
          Back to studies
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium text-[var(--ink)]">
          Search participants
        </h1>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          Find people who match what you&apos;re looking for and invite them directly —
          no waiting for them to find your study.
        </p>

        {!myStudies || myStudies.length === 0 ? (
          <Card className="mt-6">
            <p className="text-sm text-[var(--ink)]/70">
              You need a draft or active study before you can invite anyone. Create
              one first, then come back here.
            </p>
            <Link
              href="/researcher/studies/new"
              className={`mt-2 inline-block text-sm ${mutedLinkClasses}`}
            >
              New study
            </Link>
          </Card>
        ) : (
          <Card as="form" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <label className="col-span-2 block text-xs font-medium text-[var(--ink)]/60 sm:col-span-3">
              Inviting to
              <select
                name="study_id"
                defaultValue={filters.study_id ?? myStudies[0].id}
                className={fieldClasses}
              >
                {myStudies.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-[var(--ink)]/60">
              District
              <select name="district" defaultValue={filters.district ?? ""} className={fieldClasses}>
                <option value="">Any district</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-[var(--ink)]/60">
              Min age
              <input
                type="number"
                name="min_age"
                min={1}
                defaultValue={filters.min_age ?? ""}
                className={fieldClasses}
              />
            </label>

            <label className="block text-xs font-medium text-[var(--ink)]/60">
              Max age
              <input
                type="number"
                name="max_age"
                min={1}
                defaultValue={filters.max_age ?? ""}
                className={fieldClasses}
              />
            </label>

            <label className="block text-xs font-medium text-[var(--ink)]/60">
              Device
              <select name="device" defaultValue={filters.device ?? ""} className={fieldClasses}>
                <option value="">Any device</option>
                {DEVICES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-[var(--ink)]/60">
              Language
              <select name="language" defaultValue={filters.language ?? ""} className={fieldClasses}>
                <option value="">Any language</option>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>

            <div className="col-span-2 flex items-end gap-3 sm:col-span-3">
              <Button type="submit" size="sm">
                Search
              </Button>
              {hasActiveFilters && (
                <Link href="/researcher/participants" className={`text-sm ${mutedLinkClasses}`}>
                  Clear filters
                </Link>
              )}
            </div>
          </Card>
        )}

        {myStudies && myStudies.length > 0 && (
          <>
            {!results || results.length === 0 ? (
              <EmptyState
                title="No matches"
                body="No participants match these filters — try widening your search."
              />
            ) : (
              <ul className="mt-8 space-y-3">
                {results.map((p) => (
                  <Card
                    as="li"
                    key={p.id}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--ink)]">{p.full_name ?? "Participant"}</p>
                      <p className="mt-0.5 text-sm text-[var(--ink)]/60">
                        {[p.district, p.age ? `${p.age} yrs` : null, p.occupation]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {(p.languages?.length || p.devices?.length) && (
                        <p className="mt-1 text-xs text-[var(--ink)]/50">
                          {[...(p.languages ?? []), ...(p.devices ?? [])].join(" · ")}
                        </p>
                      )}
                    </div>
                    <InviteButton
                      studyId={filters.study_id ?? myStudies[0].id}
                      participantId={p.id}
                    />
                  </Card>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
