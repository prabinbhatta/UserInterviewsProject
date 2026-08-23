"use client";

import { useActionState } from "react";
import { applyToStudy } from "./actions";

type Option = { id: string; label: string };
type Question = {
  id: string;
  question_text: string;
  type: "pick_one" | "pick_any" | "short_answer" | "long_answer";
  required: boolean;
  screener_options: Option[];
};

export function ApplyForm({
  studyId,
  questions,
}: {
  studyId: string;
  questions: Question[];
}) {
  const boundApply = applyToStudy.bind(null, studyId);
  const [state, formAction, pending] = useActionState(boundApply, {
    error: null,
  });

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {questions.map((question) => (
        <fieldset key={question.id} className="rounded-lg border border-zinc-200 bg-white p-5">
          <legend className="font-medium text-zinc-900">
            {question.question_text}
            {question.required && (
              <span className="ml-2 text-xs text-zinc-400">required</span>
            )}
          </legend>

          {question.type === "pick_one" && (
            <div className="mt-3 space-y-2">
              {question.screener_options.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 hover:bg-zinc-50"
                >
                  <input
                    type="radio"
                    name={`q_${question.id}`}
                    value={option.id}
                    required={question.required}
                    className="h-4 w-4"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}

          {question.type === "pick_any" && (
            <div className="mt-3 space-y-2">
              {question.screener_options.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 hover:bg-zinc-50"
                >
                  <input
                    type="checkbox"
                    name={`q_${question.id}`}
                    value={option.id}
                    className="h-4 w-4"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}

          {question.type === "short_answer" && (
            <input
              type="text"
              name={`q_${question.id}`}
              required={question.required}
              className="mt-3 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
            />
          )}

          {question.type === "long_answer" && (
            <textarea
              name={`q_${question.id}`}
              required={question.required}
              rows={4}
              className="mt-3 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
            />
          )}
        </fieldset>
      ))}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
