"use client";

import { useActionState } from "react";
import { fileReport } from "@/app/report-actions";

export function ReportForm({
  applicationId,
  studyId,
}: {
  applicationId?: string;
  studyId?: string;
}) {
  const [state, formAction, pending] = useActionState(fileReport, {
    error: null,
    success: false,
  });

  if (state.success) {
    return (
      <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-medium text-emerald-900">Report received.</p>
        <p className="mt-1 text-sm text-emerald-800">
          Our team will review this and follow up if we need more
          information. Thanks for flagging it.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {applicationId && (
        <input type="hidden" name="application_id" value={applicationId} />
      )}
      {studyId && <input type="hidden" name="study_id" value={studyId} />}

      <label className="block text-sm font-medium text-zinc-700">
        What happened?
        <textarea
          name="reason"
          required
          rows={5}
          placeholder="Describe what happened — the more detail, the faster we can look into it."
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Submitting..." : "Submit report"}
      </button>
    </form>
  );
}
