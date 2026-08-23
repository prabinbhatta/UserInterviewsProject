import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageThread } from "@/app/MessageThread";

type ApplicationDetail = {
  id: string;
  participant_id: string;
  studies: { title: string; profiles: { full_name: string | null } | null } | null;
};

export default async function ParticipantMessagesPage({
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

  const { data: application } = (await supabase
    .from("applications")
    .select("id, participant_id, studies(title, profiles(full_name))")
    .eq("id", id)
    .single()) as { data: ApplicationDetail | null };

  if (!application || application.participant_id !== user.id) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("application_id", id)
    .order("created_at", { ascending: true });

  const researcherName = application.studies?.profiles?.full_name ?? "the researcher";

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/participant/applications" className="text-sm text-zinc-500 underline">
          Back to your applications
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          {application.studies?.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Conversation with {researcherName}
        </p>

        <MessageThread
          applicationId={id}
          revalidatePath={`/participant/applications/${id}/messages`}
          currentUserId={user.id}
          otherPartyLabel={researcherName}
          messages={messages ?? []}
        />
      </div>
    </div>
  );
}
