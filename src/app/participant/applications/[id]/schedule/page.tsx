import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { bookSlot, cancelMyBooking } from "./actions";
import { getLang } from "@/lib/getLang";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mutedLinkClasses } from "@/components/ui/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { LocalDateTime } from "@/components/ui/LocalDateTime";

export default async function ScheduleApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { t } = await getLang();
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
    .select("id, starts_at, location, application_id")
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
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/participant/applications" className={`text-sm ${mutedLinkClasses}`}>
          {t("backToYourApplicationsLink")}
        </Link>
        <h1 className="mt-2 font-display text-2xl font-medium text-[var(--ink)]">
          {t("scheduleTitlePrefix")} {title}
        </h1>

        {myBookedSlot ? (
          <Card className="mt-8">
            <p className="font-medium text-[var(--ink)]">{t("confirmedForLabel")}</p>
            <p className="mt-1 text-[var(--ink)]/80">
              <LocalDateTime iso={myBookedSlot.starts_at} />
            </p>
            {myBookedSlot.location && (
              <p className="mt-1 text-sm text-[var(--ink)]/60">
                {myBookedSlot.location}
              </p>
            )}
            <div className="mt-4 flex items-center gap-4">
              <a
                href={`/calendar/${myBookedSlot.id}`}
                className={`text-sm ${mutedLinkClasses}`}
              >
                {t("addToCalendarAction")}
              </a>
              <form action={boundCancel}>
                <button
                  type="submit"
                  className={`text-sm ${mutedLinkClasses}`}
                >
                  {t("cancelBookingAction")}
                </button>
              </form>
            </div>
          </Card>
        ) : openSlots.length === 0 ? (
          <EmptyState title={t("emptySlotsTitle")} body={t("noOpenSlotsParticipant")} />
        ) : (
          <ul className="mt-8 space-y-2">
            {openSlots.map((slot) => (
              <Card
                as="li"
                key={slot.id}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-[var(--ink)]">
                    <LocalDateTime iso={slot.starts_at} />
                  </p>
                  {slot.location && (
                    <p className="mt-0.5 text-sm text-[var(--ink)]/70">
                      {slot.location}
                    </p>
                  )}
                </div>
                <form action={boundBook.bind(null, slot.id)}>
                  <Button type="submit" size="sm" className="shrink-0">
                    {t("bookAction")}
                  </Button>
                </form>
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
