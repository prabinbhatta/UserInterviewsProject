"use client";

import { useActionState } from "react";
import { updateNotificationPreferences } from "./actions";

type Prefs = {
  notify_approved: boolean;
  notify_scheduled: boolean;
  notify_messages: boolean;
  notify_incentives: boolean;
};

export function SettingsForm({ defaultValues }: { defaultValues: Prefs }) {
  const [state, formAction, pending] = useActionState(
    updateNotificationPreferences,
    { error: null },
  );

  return (
    <form action={formAction} className="mt-6 rounded-lg border border-zinc-200 bg-white p-5">
      <p className="text-sm font-medium text-zinc-700">Email me when...</p>

      <div className="mt-3 space-y-3">
        <label className="flex items-center gap-3 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="notify_approved"
            defaultChecked={defaultValues.notify_approved}
            className="h-4 w-4"
          />
          My application is approved
        </label>
        <label className="flex items-center gap-3 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="notify_scheduled"
            defaultChecked={defaultValues.notify_scheduled}
            className="h-4 w-4"
          />
          A session is booked or cancelled
        </label>
        <label className="flex items-center gap-3 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="notify_messages"
            defaultChecked={defaultValues.notify_messages}
            className="h-4 w-4"
          />
          I get a new message
        </label>
        <label className="flex items-center gap-3 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="notify_incentives"
            defaultChecked={defaultValues.notify_incentives}
            className="h-4 w-4"
          />
          An incentive is sent to me
        </label>
      </div>

      {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}
      {state.saved && (
        <p className="mt-3 text-sm text-emerald-700">Preferences saved.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save preferences"}
      </button>
    </form>
  );
}
