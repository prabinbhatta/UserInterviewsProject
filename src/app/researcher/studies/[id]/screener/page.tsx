import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuestionForm } from "./QuestionForm";
import { deleteQuestion } from "./actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mutedLinkClasses } from "@/components/ui/link";

const typeLabels: Record<string, string> = {
  pick_one: "Pick one",
  pick_any: "Pick any",
  short_answer: "Short answer",
  long_answer: "Long answer",
};

export default async function ScreenerPage({
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

  const { data: questions } = await supabase
    .from("screener_questions")
    .select(
      "id, question_text, type, required, created_at, screener_options(id, label, decision, sort_order)",
    )
    .eq("study_id", id)
    .order("created_at", { ascending: true });

  const boundDeleteQuestion = deleteQuestion.bind(null, id);

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className={`text-sm ${mutedLinkClasses}`}>
          Back to studies
        </Link>
        <h1 className="mt-2 font-serif-display text-2xl font-medium text-[var(--ink)]">
          Screener — {study.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          Applicants who answer with a Rejected option are automatically
          screened out. Everyone else lands in your review queue.
        </p>

        {questions && questions.length > 0 && (
          <ul className="mt-8 space-y-3">
            {questions.map((q) => (
              <Card as="li" key={q.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[var(--ink)]">
                      {q.question_text}
                      {q.required && (
                        <span className="ml-2 text-xs text-[var(--ink)]/60">
                          Required
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--ink)]/70">
                      {typeLabels[q.type]}
                    </p>
                    {q.screener_options && q.screener_options.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {[...q.screener_options]
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((o) => (
                            <li key={o.id}>
                              <Badge tone={o.decision === "accept" ? "success" : "danger"}>
                                {o.label} ({o.decision === "accept" ? "Accept" : "Reject"})
                              </Badge>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                  <form action={boundDeleteQuestion.bind(null, q.id)}>
                    <button
                      type="submit"
                      className="text-sm text-[var(--ink)]/60 hover:text-[#a8371c]"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </Card>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <QuestionForm studyId={id} />
        </div>
      </div>
    </div>
  );
}
