import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { acceptInvite } from "./actions";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";
import { Button } from "@/components/ui/Button";
import { mutedLinkClasses } from "@/components/ui/link";

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
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <Card className="w-full max-w-lg">
        <p className="text-sm font-medium text-[var(--ink)]/70">
          You&apos;re invited to join a study
        </p>
        <h1 className="mt-1 font-serif-display text-2xl font-medium text-[var(--ink)]">
          {study?.title}
        </h1>
        {study && (
          <p className="mt-1 text-sm text-[var(--ink)]/60">
            {formatLabels[study.format]} · {study.session_length_minutes} min
            · NPR {study.incentive_amount}
          </p>
        )}
        {study?.description && (
          <p className="mt-4 text-[var(--ink)]/80">{study.description}</p>
        )}

        <div className="mt-6 border-t border-[var(--mist)]/60 pt-6">
          {invite.status === "accepted" ? (
            <p className="text-sm text-[var(--ink)]/60">
              This invite has already been used.{" "}
              <Link href="/participant/applications" className={mutedLinkClasses}>
                View your applications
              </Link>
              .
            </p>
          ) : study?.status !== "active" ? (
            <p className="text-sm text-[var(--ink)]/60">
              This study is no longer accepting participants — it&apos;s
              already full.
            </p>
          ) : !user ? (
            <div>
              <p className="text-sm text-[var(--ink)]/80">
                Sign up or log in as a participant, then come back to this
                same link to join — no screener needed, you&apos;re already
                approved.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <LinkButton href="/signup?role=participant" variant="primary">
                  Sign up
                </LinkButton>
                <LinkButton href="/login" variant="secondary">
                  Log in
                </LinkButton>
              </div>
            </div>
          ) : profile?.role !== "participant" ? (
            <p className="text-sm text-[var(--ink)]/60">
              This invite is for a participant account, and you&apos;re
              signed in as a researcher. Log in with a participant account
              to join.
            </p>
          ) : (
            <form action={acceptInvite.bind(null, token)}>
              <Button type="submit">Join this study</Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
