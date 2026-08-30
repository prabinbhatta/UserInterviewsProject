import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { one } from "@/lib/one";
import { ReportForm } from "./ReportForm";
import { BackButton } from "./BackButton";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ applicationId?: string; studyId?: string }>;
}) {
  const { applicationId, studyId } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let context: string | null = null;

  if (applicationId) {
    const { data: application } = await supabase
      .from("applications")
      .select("participant_id, profiles(full_name), studies(title, profiles(full_name))")
      .eq("id", applicationId)
      .single();

    if (application) {
      const participant = one(application.profiles);
      const study = one(application.studies);
      const researcher = one(study?.profiles);
      const isReporterParticipant = application.participant_id === user.id;
      const otherPartyName = isReporterParticipant
        ? (researcher?.full_name ?? "the researcher")
        : (participant?.full_name ?? "the participant");
      context = `Reporting ${otherPartyName} about "${study?.title ?? "this study"}"`;
    }
  } else if (studyId) {
    const { data: study } = await supabase
      .from("studies")
      .select("title")
      .eq("id", studyId)
      .single();
    context = study ? `Reporting "${study.title}"` : "Reporting this study";
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <BackButton />
        <h1 className="mt-2 font-display text-2xl font-medium text-[var(--ink)]">
          Report a problem
        </h1>
        {context && <p className="mt-1 text-[var(--ink)]/70">{context}</p>}
        <p className="mt-1 text-sm text-[var(--ink)]/70">
          For urgent issues you can also reach support directly at{" "}
          <span className="font-medium text-[var(--ink)]/80">+977-9715633635</span>.
        </p>

        <ReportForm applicationId={applicationId} studyId={studyId} />
      </div>
    </div>
  );
}
