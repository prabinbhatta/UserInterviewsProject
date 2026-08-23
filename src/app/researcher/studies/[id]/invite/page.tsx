import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InviteForm } from "./InviteForm";
import { CsvInviteForm } from "./CsvInviteForm";
import { InviteLink } from "./InviteLink";

export default async function StudyInvitePage({
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
    .select("id, title, researcher_id")
    .eq("id", id)
    .single();

  if (!study || study.researcher_id !== user.id) {
    notFound();
  }

  const { data: invitations } = await supabase
    .from("study_invitations")
    .select("id, email, full_name, token, status, invited_at")
    .eq("study_id", id)
    .order("invited_at", { ascending: false });

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className="text-sm text-zinc-500 underline">
          Back to studies
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Invite participants — {study.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Bring your own users straight into this study, without waiting
          for them to find it in the public list.
        </p>

        <div className="mt-6">
          <InviteForm studyId={id} />
          <CsvInviteForm studyId={id} />
        </div>

        {invitations && invitations.length > 0 && (
          <ul className="mt-6 space-y-2">
            {invitations.map((invite) => (
              <li
                key={invite.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {invite.email}
                    {invite.full_name ? ` — ${invite.full_name}` : ""}
                  </p>
                  <span
                    className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      invite.status === "accepted"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {invite.status === "accepted" ? "Joined" : "Invited"}
                  </span>
                </div>
                {invite.status !== "accepted" && (
                  <InviteLink token={invite.token} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
