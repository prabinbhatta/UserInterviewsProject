import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { confirmIncentiveReceived, reportIncentiveNotReceived } from "@/app/incentive-actions";
import { withdrawApplication, submitParticipantRating } from "./actions";
import { getLang } from "@/lib/getLang";
import type { TranslationKey } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mutedLinkClasses } from "@/components/ui/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/LinkButton";
import { StarRatingInput, StarRatingDisplay } from "@/components/ui/StarRating";
import { applicationStatusTones as statusTones } from "@/lib/applicationStatus";

const statusLabelKeys: Record<string, TranslationKey> = {
  qualified: "statusQualified",
  rejected: "statusRejected",
  approved: "statusApproved",
  scheduled: "statusScheduled",
  completed: "statusSessionCompleted",
  no_show: "statusNoShowParticipant",
  withdrawn: "statusWithdrawnParticipant",
};

type ApplicationRow = {
  id: string;
  status: keyof typeof statusTones;
  created_at: string;
  studies: { id: string; title: string; incentive_amount: number } | null;
  incentive_records: {
    status: "pending" | "sent" | "received" | "not_received";
    amount: number;
  } | null;
  session_ratings: { rating: number; rater_role: string }[] | null;
};

export default async function MyApplicationsPage() {
  const { t } = await getLang();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: applications } = (await supabase
    .from("applications")
    .select(
      "id, status, created_at, studies(id, title, incentive_amount), incentive_records(status, amount), session_ratings(rating, rater_role)",
    )
    .eq("participant_id", user.id)
    .order("created_at", { ascending: false })) as {
    data: ApplicationRow[] | null;
  };

  const revalidateTarget = "/participant/applications";

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/participant" className={`text-sm ${mutedLinkClasses}`}>
          {t("backToDashboard")}
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium text-[var(--ink)]">
          {t("yourApplicationsTitle")}
        </h1>

        {!applications || applications.length === 0 ? (
          <EmptyState
            title={t("emptyApplicationsTitle")}
            body={t("notAppliedYetPrefix")}
            action={
              <LinkButton href="/participant/studies" variant="primary" size="sm">
                {t("browseStudies")}
              </LinkButton>
            }
          />
        ) : (
          <ul className="mt-8 space-y-3">
            {applications.map((application) => (
              <Card as="li" key={application.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-[var(--ink)]">
                      {application.studies?.title}
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--ink)]/70">
                      NPR {application.studies?.incentive_amount}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {application.status !== "rejected" && (
                      <Link
                        href={`/participant/applications/${application.id}/messages`}
                        className={`text-sm ${mutedLinkClasses}`}
                      >
                        {t("messageAction")}
                      </Link>
                    )}
                    {(application.status === "approved" ||
                      application.status === "scheduled") && (
                      <Link
                        href={`/participant/applications/${application.id}/schedule`}
                        className={`text-sm ${mutedLinkClasses}`}
                      >
                        {application.status === "scheduled"
                          ? t("viewTimeLink")
                          : t("pickATimeLink")}
                      </Link>
                    )}
                    {(application.status === "qualified" ||
                      application.status === "approved") && (
                      <form
                        action={withdrawApplication.bind(null, application.id)}
                      >
                        <button
                          type="submit"
                          className={`text-sm ${mutedLinkClasses}`}
                        >
                          {t("withdrawAction")}
                        </button>
                      </form>
                    )}
                    <Badge tone={statusTones[application.status]}>
                      {t(statusLabelKeys[application.status])}
                    </Badge>
                  </div>
                </div>

                {application.status === "completed" &&
                  application.incentive_records && (
                    <div className="mt-3 border-t border-[var(--line)]/50 pt-3">
                      {application.incentive_records.status === "pending" && (
                        <p className="text-sm text-[var(--ink)]/70">
                          {t("incentiveNotSentYetParticipant")}
                        </p>
                      )}

                      {application.incentive_records.status === "sent" && (
                        <div>
                          <p className="text-sm text-[var(--ink)]/80">
                            {t("incentiveSentQuestionPrefix")}{" "}
                            {application.incentive_records.amount}{" "}
                            {t("incentiveSentQuestionSuffix")}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <form
                              action={confirmIncentiveReceived.bind(
                                null,
                                application.id,
                                revalidateTarget,
                              )}
                            >
                              <Button type="submit" size="sm">
                                {t("yesReceivedIt")}
                              </Button>
                            </form>
                            <form
                              action={reportIncentiveNotReceived.bind(
                                null,
                                application.id,
                                revalidateTarget,
                              )}
                            >
                              <Button type="submit" size="sm" variant="secondary">
                                {t("noHaventReceivedIt")}
                              </Button>
                            </form>
                          </div>
                        </div>
                      )}

                      {application.incentive_records.status === "received" && (
                        <p className="text-sm text-emerald-700">
                          {t("receivedThanksMessage")}
                        </p>
                      )}

                      {application.incentive_records.status ===
                        "not_received" && (
                        <div className="rounded-lg bg-[var(--danger)]/10 p-3 text-sm text-[#a8371c]">
                          <p className="font-medium">
                            {t("notReceivedReportedTitle")}
                          </p>
                          <p className="mt-1">
                            {t("notReceivedFollowup")}{" "}
                            <span className="font-medium">
                              +977-9715633635
                            </span>
                            .
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                {application.status === "completed" && (
                  <div className="mt-3 border-t border-[var(--line)]/50 pt-3">
                    {(() => {
                      const myRating = application.session_ratings?.find(
                        (r) => r.rater_role === "participant",
                      );
                      if (myRating) {
                        return (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[var(--ink)]/70">
                              {t("yourRatingLabel")}:
                            </span>
                            <StarRatingDisplay rating={myRating.rating} />
                          </div>
                        );
                      }
                      return (
                        <form
                          action={submitParticipantRating.bind(null, application.id)}
                          className="flex flex-col gap-2"
                        >
                          <p className="text-sm text-[var(--ink)]/70">
                            {t("rateSessionPrompt")}
                          </p>
                          <StarRatingInput name="rating" />
                          <textarea
                            name="comment"
                            rows={2}
                            placeholder={t("ratingCommentPlaceholder")}
                            className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink)]/40 focus:border-[var(--navy)] focus:outline-none"
                          />
                          <Button type="submit" size="sm" className="self-start">
                            {t("submitRatingAction")}
                          </Button>
                        </form>
                      );
                    })()}
                  </div>
                )}
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
