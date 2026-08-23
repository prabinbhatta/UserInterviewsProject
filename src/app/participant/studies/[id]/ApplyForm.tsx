"use client";

import { useActionState } from "react";
import { applyToStudy } from "./actions";
import { useLanguage } from "@/app/LanguageProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fieldClasses } from "@/components/ui/field";

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
  const { t } = useLanguage();

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {questions.map((question) => (
        <Card as="fieldset" key={question.id}>
          <legend className="font-medium text-[var(--ink)]">
            {question.question_text}
            {question.required && (
              <span className="ml-2 text-xs text-[var(--ink)]/60">{t("requiredTag")}</span>
            )}
          </legend>

          {question.type === "pick_one" && (
            <div className="mt-3 space-y-2">
              {question.screener_options.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--mist)] px-4 py-3 hover:bg-[var(--paper)]"
                >
                  <input
                    type="radio"
                    name={`q_${question.id}`}
                    value={option.id}
                    required={question.required}
                    className="h-4 w-4 accent-[var(--indigo)]"
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
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--mist)] px-4 py-3 hover:bg-[var(--paper)]"
                >
                  <input
                    type="checkbox"
                    name={`q_${question.id}`}
                    value={option.id}
                    className="h-4 w-4 accent-[var(--indigo)]"
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
              className={`${fieldClasses} mt-3`}
            />
          )}

          {question.type === "long_answer" && (
            <textarea
              name={`q_${question.id}`}
              required={question.required}
              rows={4}
              className={`${fieldClasses} mt-3`}
            />
          )}
        </Card>
      ))}

      {state.error && <p className="text-sm text-[#a8371c]">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t("submittingApplication") : t("submitApplication")}
      </Button>
    </form>
  );
}
