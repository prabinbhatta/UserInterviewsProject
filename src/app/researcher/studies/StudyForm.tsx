"use client";

import { useActionState, useState } from "react";
import type { StudyFormState } from "./actions";
import { DISTRICTS } from "@/lib/districts";
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
  const [state, formAction, pending] = useActionState(action, { error: null });
  const [format, setFormat] = useState(defaultValues?.format ?? "online");

  return (
    <form action={formAction} className="w-full max-w-xl">
      <label className={labelClasses}>
        Study title
        <input
          type="text"
          name="title"
          required
          defaultValue={defaultValues?.title}
          className={fieldClasses}
        />
      </label>

      <label className={`mt-4 ${labelClasses}`}>
        Description
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
          Format
          <select
            name="format"
            value={format}
            onChange={(e) =>
              setFormat(e.target.value as "online" | "in_person" | "phone")
            }
            className={fieldClasses}
          >
            <option value="online">Online</option>
            <option value="in_person">In person</option>
            <option value="phone">Phone</option>
          </select>
        </label>

        <label className={labelClasses}>
          Session length (minutes)
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
          District
          <select
            name="district"
            defaultValue={defaultValues?.district ?? ""}
            className={fieldClasses}
          >
            <option value="">Select a district</option>
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
          Participants needed
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
          Incentive (NPR)
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
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
