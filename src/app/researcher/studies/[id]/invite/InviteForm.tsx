"use client";

import { useActionState } from "react";
import { createInvites } from "./actions";

export function InviteForm({ studyId }: { studyId: string }) {
  const boundCreate = createInvites.bind(null, studyId);
  const [state, formAction, pending] = useActionState(boundCreate, {
    error: null,
  });

  return (
    <form action={formAction} className="rounded-lg border border-zinc-200 bg-white p-5">
      <label className="block text-sm font-medium text-zinc-700">
        Invite by email
        <textarea
          name="emails"
          required
          rows={4}
          placeholder={"One email per line, or comma-separated —\nramesh@bank.com, sita@bank.com"}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>
      <p className="mt-1.5 text-xs text-zinc-500">
        Each address gets its own private link below — copy and send it
        however you&apos;d like. Anyone who opens it and signs up (or logs
        in) joins this study automatically, skipping the screener.
      </p>

      {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Generating..." : "Generate invite links"}
      </button>
    </form>
  );
}
