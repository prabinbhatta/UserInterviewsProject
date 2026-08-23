"use client";

import { useActionState } from "react";
import type { StudyFormState } from "./actions";

type StudyFormValues = {
  title: string;
  description: string;
  format: "online" | "in_person" | "phone";
  session_length_minutes: number;
  participants_needed: number;
  incentive_amount: number;
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

  return (
    <form action={formAction} className="w-full max-w-xl">
      <label className="block text-sm font-medium text-zinc-700">
        Study title
        <input
          type="text"
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-zinc-700">
        Description
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={defaultValues?.description}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-zinc-700">
          Format
          <select
            name="format"
            defaultValue={defaultValues?.format ?? "online"}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
          >
            <option value="online">Online</option>
            <option value="in_person">In person</option>
            <option value="phone">Phone</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          Session length (minutes)
          <input
            type="number"
            name="session_length_minutes"
            required
            min={1}
            defaultValue={defaultValues?.session_length_minutes ?? 30}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-zinc-700">
          Participants needed
          <input
            type="number"
            name="participants_needed"
            required
            min={1}
            defaultValue={defaultValues?.participants_needed ?? 5}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          Incentive (NPR)
          <input
            type="number"
            name="incentive_amount"
            required
            min={0}
            step="0.01"
            defaultValue={defaultValues?.incentive_amount ?? 500}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
          />
        </label>
      </div>

      {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
