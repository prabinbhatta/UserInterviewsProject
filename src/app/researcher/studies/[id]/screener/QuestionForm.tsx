"use client";

import { useActionState, useState } from "react";
import { addQuestion, type ScreenerFormState } from "./actions";

type OptionRow = { label: string; decision: "accept" | "reject" };
type QuestionType = "pick_one" | "pick_any" | "short_answer" | "long_answer";

const emptyOptions = (): OptionRow[] => [
  { label: "", decision: "accept" },
  { label: "", decision: "accept" },
];

export function QuestionForm({ studyId }: { studyId: string }) {
  const boundAddQuestion = addQuestion.bind(null, studyId);
  const [state, formAction, pending] = useActionState(boundAddQuestion, {
    error: null,
  });

  // Remounting QuestionFields (via `key`) after a successful submission is
  // what actually resets the form — it re-initializes all local state and
  // clears uncontrolled inputs, without needing setState inside an effect.
  const [formKey, setFormKey] = useState(0);
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state.error === null) setFormKey((k) => k + 1);
  }

  return (
    <QuestionFields
      key={formKey}
      formAction={formAction}
      pending={pending}
      error={state.error}
    />
  );
}

function QuestionFields({
  formAction,
  pending,
  error,
}: {
  formAction: (formData: FormData) => void;
  pending: boolean;
  error: ScreenerFormState["error"];
}) {
  const [type, setType] = useState<QuestionType>("pick_one");
  const [options, setOptions] = useState<OptionRow[]>(emptyOptions());
  const isChoiceType = type === "pick_one" || type === "pick_any";

  return (
    <form action={formAction} className="rounded-lg border border-zinc-200 bg-white p-5">
      <label className="block text-sm font-medium text-zinc-700">
        Question
        <input
          type="text"
          name="question_text"
          required
          placeholder="Do you have a laptop with a webcam?"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-zinc-700">
          Answer type
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as QuestionType)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
          >
            <option value="pick_one">Pick one</option>
            <option value="pick_any">Pick any</option>
            <option value="short_answer">Short answer</option>
            <option value="long_answer">Long answer</option>
          </select>
        </label>

        <label className="mt-6 flex items-center gap-2 text-sm font-medium text-zinc-700">
          <input type="checkbox" name="required" defaultChecked className="h-4 w-4" />
          Required
        </label>
      </div>

      {isChoiceType && (
        <div className="mt-4">
          <p className="text-sm font-medium text-zinc-700">
            Answer options — mark each one Accept or Reject
          </p>
          <div className="mt-2 space-y-2">
            {options.map((option, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  name="option_label"
                  required
                  value={option.label}
                  placeholder={`Option ${i + 1}`}
                  onChange={(e) => {
                    const next = [...options];
                    next[i] = { ...next[i], label: e.target.value };
                    setOptions(next);
                  }}
                  className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
                />
                <select
                  name="option_decision"
                  value={option.decision}
                  onChange={(e) => {
                    const next = [...options];
                    next[i] = {
                      ...next[i],
                      decision: e.target.value as "accept" | "reject",
                    };
                    setOptions(next);
                  }}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
                >
                  <option value="accept">Accept</option>
                  <option value="reject">Reject</option>
                </select>
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setOptions(options.filter((_, j) => j !== i))}
                    className="text-sm text-zinc-400 hover:text-red-600"
                    aria-label="Remove option"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOptions([...options, { label: "", decision: "accept" }])}
            className="mt-2 text-sm text-zinc-600 underline"
          >
            Add option
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Adding..." : "Add question"}
      </button>
    </form>
  );
}
