"use client";

import { useRef, useState, useTransition } from "react";
import { updateNotificationPreferences, type SettingsFormState } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";

type Prefs = {
  notify_approved: boolean;
  notify_scheduled: boolean;
  notify_messages: boolean;
  notify_incentives: boolean;
};

const FIELDS: { name: keyof Prefs; label: string }[] = [
  { name: "notify_approved", label: "My application is approved" },
  { name: "notify_scheduled", label: "A session is booked or cancelled" },
  { name: "notify_messages", label: "I get a new message" },
  { name: "notify_incentives", label: "An incentive is sent to me" },
];

export function SettingsForm({ defaultValues }: { defaultValues: Prefs }) {
  const [state, setState] = useState<SettingsFormState>({ error: null });
  const [pending, startTransition] = useTransition();
  // Controlled + a plain onSubmit handler rather than <form action={fn}>:
  // React 19 resets a <form action={fn}> back to its DOM-attribute
  // defaults after a successful submission, and that reset can land after
  // React's own re-render, silently reverting checkboxes even though the
  // save succeeded. See ProfileForm for the fuller version of this note.
  const [prefs, setPrefs] = useState(defaultValues);
  const noticeRef = useRef<HTMLDivElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateNotificationPreferences(state, formData);
      setState(result);
      if (result.saved && result.values) {
        setPrefs(result.values);
      }
      requestAnimationFrame(() => {
        noticeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className="mt-6">
      <p className="text-sm font-medium text-[var(--ink)]/80">Email me when...</p>

      <div className="mt-3 space-y-3">
        {FIELDS.map((field) => (
          <label
            key={field.name}
            className="flex items-center gap-3 text-sm text-[var(--ink)]/80"
          >
            <input
              type="checkbox"
              name={field.name}
              checked={prefs[field.name]}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, [field.name]: e.target.checked }))
              }
              className="h-4 w-4 accent-[var(--navy)]"
            />
            {field.label}
          </label>
        ))}
      </div>

      <div ref={noticeRef}>
        {state.error && (
          <Notice tone="danger" className="mt-3">
            {state.error}
          </Notice>
        )}
        {state.saved && !state.error && (
          <Notice tone="success" className="mt-3">
            Preferences saved.
          </Notice>
        )}
      </div>

      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? "Saving..." : "Save preferences"}
      </Button>
    </Card>
  );
}
