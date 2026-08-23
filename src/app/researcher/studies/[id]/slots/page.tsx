import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SlotForm } from "./SlotForm";
import { deleteSlot, cancelBooking } from "./actions";
import { Card } from "@/components/ui/Card";
import { mutedLinkClasses } from "@/components/ui/link";

type SlotRow = {
  id: string;
  starts_at: string;
  location: string | null;
  application_id: string | null;
  applications: { profiles: { full_name: string | null } | null } | null;
};

export default async function StudySlotsPage({
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
    .select("id, title, format, researcher_id")
    .eq("id", id)
    .single();

  if (!study || study.researcher_id !== user.id) {
    notFound();
  }

  const { data: slots } = (await supabase
    .from("study_slots")
    .select(
      "id, starts_at, location, application_id, applications(profiles(full_name))",
    )
    .eq("study_id", id)
    .order("starts_at", { ascending: true })) as { data: SlotRow[] | null };

  const boundDelete = deleteSlot.bind(null, id);
  const boundCancel = cancelBooking.bind(null, id);

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className={`text-sm ${mutedLinkClasses}`}>
          Back to studies
        </Link>
        <h1 className="mt-2 font-serif-display text-2xl font-medium text-[var(--ink)]">
          Time slots — {study.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          Approved participants can pick any open slot below.
        </p>

        {slots && slots.length > 0 && (
          <ul className="mt-8 space-y-2">
            {slots.map((slot) => (
              <Card
                as="li"
                key={slot.id}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-[var(--ink)]">
                    {new Date(slot.starts_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--ink)]/50">
                    {slot.application_id
                      ? `Booked by ${slot.applications?.profiles?.full_name ?? "a participant"}`
                      : "Open"}
                  </p>
                  {slot.location && (
                    <p className="mt-0.5 text-sm text-[var(--ink)]/50">
                      {slot.location}
                    </p>
                  )}
                </div>
                {slot.application_id ? (
                  <form action={boundCancel.bind(null, slot.application_id)}>
                    <button
                      type="submit"
                      className={`shrink-0 text-sm ${mutedLinkClasses}`}
                    >
                      Cancel booking
                    </button>
                  </form>
                ) : (
                  <form action={boundDelete.bind(null, slot.id)}>
                    <button
                      type="submit"
                      className={`shrink-0 text-sm ${mutedLinkClasses}`}
                    >
                      Remove
                    </button>
                  </form>
                )}
              </Card>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <SlotForm studyId={id} format={study.format} />
        </div>
      </div>
    </div>
  );
}
