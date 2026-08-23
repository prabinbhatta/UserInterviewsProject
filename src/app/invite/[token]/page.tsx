import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { acceptInvite } from "./actions";

const formatLabels: Record<string, string> = {
  online: "Online",
  in_person: "In person",
  phone: "Phone",
};

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: invite } = await supabase
    .from("study_invitations")
    .select(
      "id, status, studies(title, description, format, session_length_minutes, incentive_amount, status)",
    )
    .eq("token", token)
    .single();

  if (!invite) {
    notFound();
  }

  const study = Array.isArray(invite.studies) ? invite.studies[0] : invite.studies;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { role: string } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-6">
        <p className="text-sm font-medium text-zinc-500">
          You&apos;re invited to join a study
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
          {study?.title}
        </h1>
        {study && (
          <p className="mt-1 text-sm text-zinc-600">
            {formatLabels[study.format]} · {study.session_length_minutes} min
            · NPR {study.incentive_amount}
          </p>
        )}
        {study?.description && (
          <p className="mt-4 text-zinc-700">{study.description}</p>
        )}

        <div className="mt-6 border-t border-zinc-100 pt-6">
          {invite.status === "accepted" ? (
            <p className="text-sm text-zinc-600">
              This invite has already been used.{" "}
              <Link href="/participant/applications" className="underline">
                View your applications
              </Link>
              .
            </p>
          ) : study?.status !== "active" ? (
            <p className="text-sm text-zinc-600">
              This study is no longer accepting participants — it&apos;s
              already full.
            </p>
          ) : !user ? (
            <div>
              <p className="text-sm text-zinc-700">
                Sign up or log in as a participant, then come back to this
                same link to join — no screener needed, you&apos;re already
                approved.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup?role=participant"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                >
                  Sign up
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
                >
                  Log in
                </Link>
              </div>
            </div>
          ) : profile?.role !== "participant" ? (
            <p className="text-sm text-zinc-600">
              This invite is for a participant account, and you&apos;re
              signed in as a researcher. Log in with a participant account
              to join.
            </p>
          ) : (
            <form action={acceptInvite.bind(null, token)}>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                Join this study
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
