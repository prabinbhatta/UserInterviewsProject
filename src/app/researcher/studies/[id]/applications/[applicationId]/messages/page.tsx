import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageThread } from "@/app/MessageThread";
import { getLang } from "@/lib/getLang";
import { mutedLinkClasses } from "@/components/ui/link";

type ApplicationDetail = {
  id: string;
  study_id: string;
  profiles: { full_name: string | null } | null;
  studies: { title: string; researcher_id: string } | null;
};

export default async function ResearcherMessagesPage({
  params,
}: {
  params: Promise<{ id: string; applicationId: string }>;
}) {
  const { id, applicationId } = await params;
  const { t } = await getLang();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: application } = (await supabase
    .from("applications")
    .select("id, study_id, profiles(full_name), studies(title, researcher_id)")
    .eq("id", applicationId)
    .single()) as { data: ApplicationDetail | null };

  if (
    !application ||
    application.study_id !== id ||
    application.studies?.researcher_id !== user.id
  ) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: true });

  const participantName = application.profiles?.full_name ?? "the participant";

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link
          href={`/researcher/studies/${id}/applications`}
          className={`text-sm ${mutedLinkClasses}`}
        >
          {t("backToApplicantsLink")}
        </Link>
        <h1 className="mt-2 font-display text-2xl font-medium text-[var(--ink)]">
          {application.studies?.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          {t("conversationWithPrefix")} {participantName}{" "}
          <Link
            href={`/report?applicationId=${applicationId}`}
            className="text-[var(--ink)]/60 underline decoration-[var(--line)] underline-offset-4 hover:text-[#a8371c]"
          >
            {t("reportAction")}
          </Link>
        </p>

        <MessageThread
          applicationId={applicationId}
          revalidatePath={`/researcher/studies/${id}/applications/${applicationId}/messages`}
          currentUserId={user.id}
          otherPartyLabel={participantName}
          messages={messages ?? []}
        />
      </div>
    </div>
  );
}
