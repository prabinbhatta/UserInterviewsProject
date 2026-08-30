"use client";

import { useActionState, useState } from "react";
import { addQuestion, type ScreenerFormState } from "./actions";
import { useLanguage } from "@/app/LanguageProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

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
  const { t } = useLanguage();
  const [type, setType] = useState<QuestionType>("pick_one");
  const [options, setOptions] = useState<OptionRow[]>(emptyOptions());
  const isChoiceType = type === "pick_one" || type === "pick_any";

  return (
    <Card as="form" action={formAction}>
      <label className={labelClasses}>
        {t("questionFieldLabel")}
        <input
          type="text"
          name="question_text"
          required
          placeholder={t("questionPlaceholderExample")}
          className={fieldClasses}
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <label className={labelClasses}>
          {t("answerTypeFieldLabel")}
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as QuestionType)}
            className={fieldClasses}
          >
            <option value="pick_one">{t("typePickOne")}</option>
            <option value="pick_any">{t("typePickAny")}</option>
            <option value="short_answer">{t("typeShortAnswer")}</option>
            <option value="long_answer">{t("typeLongAnswer")}</option>
          </select>
        </label>

        <label className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--ink)]/80">
          <input
            type="checkbox"
            name="required"
            defaultChecked
            className="h-4 w-4 accent-[var(--navy)]"
          />
          {t("requiredBadge")}
        </label>
      </div>

      {isChoiceType && (
        <div className="mt-4">
          <p className={labelClasses}>
            {t("answerOptionsHint")}
          </p>
          <div className="mt-2 space-y-2">
            {options.map((option, i) => (
              <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  name="option_label"
                  required
                  value={option.label}
                  placeholder={`${t("optionPlaceholderPrefix")} ${i + 1}`}
                  onChange={(e) => {
                    const next = [...options];
                    next[i] = { ...next[i], label: e.target.value };
                    setOptions(next);
                  }}
                  className={`${fieldClasses} mt-0 sm:flex-1`}
                />
                <div className="flex items-center gap-2">
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
                    className={`${fieldClasses} mt-0 flex-1 sm:flex-none`}
                  >
                    <option value="accept">{t("acceptLabel")}</option>
                    <option value="reject">{t("rejectLabel")}</option>
                  </select>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setOptions(options.filter((_, j) => j !== i))}
                      className="shrink-0 text-sm text-[var(--ink)]/60 hover:text-[#a8371c]"
                      aria-label={t("removeAction")}
                    >
                      {t("removeAction")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOptions([...options, { label: "", decision: "accept" }])}
            className="mt-2 text-sm text-[var(--ink)]/70 underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--signal)]"
          >
            {t("addOptionAction")}
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-[#a8371c]">{error}</p>}

      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? t("addingGeneric") : t("addQuestionAction")}
      </Button>
    </Card>
  );
}
