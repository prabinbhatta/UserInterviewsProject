"use client";

import { useActionState } from "react";
import { addSlot } from "./actions";

const locationLabels: Record<string, string> = {
  online: "Meeting link",
  in_person: "Address",
  phone: "Phone number or call details",
};

const locationPlaceholders: Record<string, string> = {
  online: "https://meet.google.com/...",
  in_person: "Kathmandu Mall, 3rd floor",
  phone: "+977-...",
};

export function SlotForm({
  studyId,
  format,
}: {
  studyId: string;
  format: string;
}) {
  const boundAddSlot = addSlot.bind(null, studyId);
  const [state, formAction, pending] = useActionState(boundAddSlot, {
    error: null,
  });

  return (
    <form
      action={formAction}
      className="rounded-lg border border-zinc-200 bg-white p-5"
    >
      <label className="block text-sm font-medium text-zinc-700">
        Add a time slot
        <input
          type="datetime-local"
          name="starts_at"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>

      <label className="mt-3 block text-sm font-medium text-zinc-700">
        {locationLabels[format] ?? "Location"}{" "}
        <span className="text-xs font-normal text-zinc-400">optional</span>
        <input
          type="text"
          name="location"
          placeholder={locationPlaceholders[format]}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>

      {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Adding..." : "Add slot"}
      </button>
    </form>
  );
}
