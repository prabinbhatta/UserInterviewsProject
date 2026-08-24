"use client";

import { useActionState, useState } from "react";
import type { StudyFormState } from "./actions";
import { DISTRICTS } from "@/lib/districts";
import { useLanguage } from "@/app/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

type StudyFormValues = {
  title: string;
  description: string;
  format: "online" | "in_person" | "phone";
  session_length_minutes: number;
  participants_needed: number;
  incentive_amount: number;
  district?: string | null;
};

export function StudyForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (state: StudyFormState, formData: FormData) => Promise<StudyFormState>;
  defaultValues?: StudyFormValues;
  submitLabel: string;
}) {
  const { t } = useLanguage();
  const [state, formAction, pending] = useActionState(action, { error: null });
  const [format, setFormat] = useState(defaultValues?.format ?? "online");

  return (
    <form action={formAction} className="w-full max-w-xl">
      <label className={labelClasses}>
        {t("studyTitleFieldLabel")}
        <input
          type="text"
          name="title"
          required
          defaultValue={defaultValues?.title}
          className={fieldClasses}
        />
      </label>

      <label className={`mt-4 ${labelClasses}`}>
        {t("descriptionFieldLabel")}
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={defaultValues?.description}
          className={fieldClasses}
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <label className={labelClasses}>
          {t("filterFormat")}
          <select
            name="format"
            value={format}
            onChange={(e) =>
              setFormat(e.target.value as "online" | "in_person" | "phone")
            }
            className={fieldClasses}
          >
            <option value="online">{t("formatOnline")}</option>
            <option value="in_person">{t("formatInPerson")}</option>
            <option value="phone">{t("formatPhone")}</option>
          </select>
        </label>

        <label className={labelClasses}>
          {t("sessionLengthFieldLabel")}
          <input
            type="number"
            name="session_length_minutes"
            required
            min={1}
            defaultValue={defaultValues?.session_length_minutes ?? 30}
            className={fieldClasses}
          />
        </label>
      </div>

      {format === "in_person" && (
        <label className={`mt-4 ${labelClasses}`}>
          {t("filterDistrict")}
          <select
            name="district"
            defaultValue={defaultValues?.district ?? ""}
            className={fieldClasses}
          >
            <option value="">{t("selectADistrict")}</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <label className={labelClasses}>
          {t("participantsNeededFieldLabel")}
          <input
            type="number"
            name="participants_needed"
            required
            min={1}
            defaultValue={defaultValues?.participants_needed ?? 5}
            className={fieldClasses}
          />
        </label>

        <label className={labelClasses}>
          {t("incentiveFieldLabel")}
          <input
            type="number"
            name="incentive_amount"
            required
            min={0}
            step="0.01"
            defaultValue={defaultValues?.incentive_amount ?? 500}
            className={fieldClasses}
          />
        </label>
      </div>

      {state.error && <p className="mt-3 text-sm text-[#a8371c]">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-6 w-full">
        {pending ? t("savingGeneric") : submitLabel}
      </Button>
    </form>
  );
}
