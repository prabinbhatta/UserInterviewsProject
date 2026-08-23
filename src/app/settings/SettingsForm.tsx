"use client";

import { useActionState } from "react";
import { updateNotificationPreferences } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
    <Card as="form" action={formAction} className="mt-6">
      <p className="text-sm font-medium text-[var(--ink)]/80">Email me when...</p>

      <div className="mt-3 space-y-3">
        <label className="flex items-center gap-3 text-sm text-[var(--ink)]/80">
          <input
            type="checkbox"
            name="notify_approved"
            defaultChecked={defaultValues.notify_approved}
            className="h-4 w-4 accent-[var(--indigo)]"
          />
          My application is approved
        </label>
        <label className="flex items-center gap-3 text-sm text-[var(--ink)]/80">
          <input
            type="checkbox"
            name="notify_scheduled"
            defaultChecked={defaultValues.notify_scheduled}
            className="h-4 w-4 accent-[var(--indigo)]"
          />
          A session is booked or cancelled
        </label>
        <label className="flex items-center gap-3 text-sm text-[var(--ink)]/80">
          <input
            type="checkbox"
            name="notify_messages"
            defaultChecked={defaultValues.notify_messages}
            className="h-4 w-4 accent-[var(--indigo)]"
          />
          I get a new message
        </label>
        <label className="flex items-center gap-3 text-sm text-[var(--ink)]/80">
          <input
            type="checkbox"
            name="notify_incentives"
            defaultChecked={defaultValues.notify_incentives}
            className="h-4 w-4 accent-[var(--indigo)]"
          />
          An incentive is sent to me
        </label>
      </div>

      {state.error && <p className="mt-3 text-sm text-[#a8371c]">{state.error}</p>}
      {state.saved && (
        <p className="mt-3 text-sm text-emerald-700">Preferences saved.</p>
      )}

      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? "Saving..." : "Save preferences"}
      </Button>
    </Card>
  );
}
