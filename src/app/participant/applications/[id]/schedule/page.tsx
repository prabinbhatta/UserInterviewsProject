import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { bookSlot, cancelMyBooking } from "./actions";

export default async function ScheduleApplicationPage({
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

  const { data: application } = await supabase
    .from("applications")
    .select("id, status, participant_id, study_id, studies(title)")
    .eq("id", id)
    .single();

  if (!application || application.participant_id !== user.id) {
    notFound();
  }
  if (!["approved", "scheduled"].includes(application.status)) {
    redirect("/participant/applications");
  }

  const { data: slots } = await supabase
    .from("study_slots")
    .select("id, starts_at, application_id")
    .eq("study_id", application.study_id)
    .order("starts_at", { ascending: true });

  const myBookedSlot = slots?.find((s) => s.application_id === application.id);
  const openSlots = slots?.filter((s) => !s.application_id) ?? [];
  const studyTitle = (
    application.studies as { title: string } | { title: string }[] | null
  );
  const title = Array.isArray(studyTitle) ? studyTitle[0]?.title : studyTitle?.title;

  const boundBook = bookSlot.bind(null, application.id);
  const boundCancel = cancelMyBooking.bind(null, application.id);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/participant/applications" className="text-sm text-zinc-500 underline">
          Back to your applications
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Schedule — {title}
        </h1>

        {myBookedSlot ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5">
            <p className="font-medium text-zinc-900">You&apos;re confirmed for:</p>
            <p className="mt-1 text-zinc-700">
              {new Date(myBookedSlot.starts_at).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <form action={boundCancel} className="mt-4">
              <button
                type="submit"
                className="text-sm text-zinc-500 underline hover:text-red-600"
              >
                Cancel booking
              </button>
            </form>
          </div>
        ) : openSlots.length === 0 ? (
          <p className="mt-8 text-zinc-600">
            No open time slots right now — check back soon, the researcher
            may add more.
          </p>
        ) : (
          <ul className="mt-8 space-y-2">
            {openSlots.map((slot) => (
              <li
                key={slot.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4"
              >
                <p className="font-medium text-zinc-900">
                  {new Date(slot.starts_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <form action={boundBook.bind(null, slot.id)}>
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                  >
                    Book
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
