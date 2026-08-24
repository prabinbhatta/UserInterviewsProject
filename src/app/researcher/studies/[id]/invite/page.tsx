import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InviteForm } from "./InviteForm";
import { CsvInviteForm } from "./CsvInviteForm";
import { InviteLink } from "./InviteLink";
import { getLang } from "@/lib/getLang";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mutedLinkClasses } from "@/components/ui/link";

export default async function StudyInvitePage({
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
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className={`text-sm ${mutedLinkClasses}`}>
          {t("backToStudies")}
        </Link>
        <h1 className="mt-2 font-serif-display text-2xl font-medium text-[var(--ink)]">
          {t("inviteParticipantsTitlePrefix")} {study.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          {t("inviteHint")}
        </p>

        <div className="mt-6">
          <InviteForm studyId={id} />
          <CsvInviteForm studyId={id} />
        </div>

        {invitations && invitations.length > 0 && (
          <ul className="mt-6 space-y-2">
            {invitations.map((invite) => (
              <Card
                as="li"
                key={invite.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--ink)]">
                    {invite.email}
                    {invite.full_name ? ` — ${invite.full_name}` : ""}
                  </p>
                  <Badge
                    tone={invite.status === "accepted" ? "success" : "neutral"}
                    className="mt-0.5"
                  >
                    {invite.status === "accepted" ? t("joinedBadgeLabel") : t("invitedBadgeLabel")}
                  </Badge>
                </div>
                {invite.status !== "accepted" && (
                  <InviteLink token={invite.token} />
                )}
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
