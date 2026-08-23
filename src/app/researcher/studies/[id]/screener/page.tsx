import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuestionForm } from "./QuestionForm";
import { deleteQuestion } from "./actions";

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
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className="text-sm text-zinc-500 underline">
          Back to studies
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Screener — {study.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Applicants who answer with a Rejected option are automatically
          screened out. Everyone else lands in your review queue.
        </p>

        {questions && questions.length > 0 && (
          <ul className="mt-8 space-y-3">
            {questions.map((q) => (
              <li
                key={q.id}
                className="rounded-lg border border-zinc-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-zinc-900">
                      {q.question_text}
                      {q.required && (
                        <span className="ml-2 text-xs text-zinc-400">
                          required
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {typeLabels[q.type]}
                    </p>
                    {q.screener_options && q.screener_options.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {[...q.screener_options]
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((o) => (
                            <li
                              key={o.id}
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                                o.decision === "accept"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  o.decision === "accept"
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }`}
                              />
                              {o.label} ({o.decision})
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                  <form action={boundDeleteQuestion.bind(null, q.id)}>
                    <button
                      type="submit"
                      className="text-sm text-zinc-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
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
