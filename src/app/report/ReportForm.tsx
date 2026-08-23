"use client";

import { useActionState } from "react";
import { fileReport } from "@/app/report-actions";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

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
      <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
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

      <label className={labelClasses}>
        What happened?
        <textarea
          name="reason"
          required
          rows={5}
          placeholder="Describe what happened — the more detail, the faster we can look into it."
          className={fieldClasses}
        />
      </label>

      {state.error && <p className="text-sm text-[#a8371c]">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit report"}
      </Button>
    </form>
  );
}
