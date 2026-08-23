"use client";

import { useActionState } from "react";
import { addSlot } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

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
    <Card as="form" action={formAction}>
      <label className={labelClasses}>
        Add a time slot
        <input
          type="datetime-local"
          name="starts_at"
          required
          className={fieldClasses}
        />
      </label>

      <label className={`mt-3 ${labelClasses}`}>
        {locationLabels[format] ?? "Location"}{" "}
        <span className="text-xs font-normal text-[var(--ink)]/40">optional</span>
        <input
          type="text"
          name="location"
          placeholder={locationPlaceholders[format]}
          className={fieldClasses}
        />
      </label>

      {state.error && <p className="mt-3 text-sm text-[#a8371c]">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? "Adding..." : "Add slot"}
      </Button>
    </Card>
  );
}
