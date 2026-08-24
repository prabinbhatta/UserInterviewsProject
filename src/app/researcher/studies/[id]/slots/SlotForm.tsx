"use client";

import { useActionState, useState } from "react";
import { addSlot } from "./actions";
import { useLanguage } from "@/app/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

const locationLabelKeys: Record<string, TranslationKey> = {
  online: "meetingLinkFieldLabel",
  in_person: "addressFieldLabel",
  phone: "phoneDetailsFieldLabel",
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
  const { t } = useLanguage();
  const boundAddSlot = addSlot.bind(null, studyId);
  const [state, formAction, pending] = useActionState(boundAddSlot, {
    error: null,
  });
  const [autoMeet, setAutoMeet] = useState(true);
  const [startsAtIso, setStartsAtIso] = useState("");

  return (
    <Card as="form" action={formAction}>
      <label className={labelClasses}>
        {t("addTimeSlotFieldLabel")}
        <input
          type="datetime-local"
          required
          className={fieldClasses}
          onChange={(e) => {
            const value = e.target.value;
            // datetime-local carries no timezone — the browser parses it
            // as the viewer's own local time, which is exactly what we
            // want to capture before it crosses to the server (where
            // "new Date(rawValue)" would instead be parsed in the
            // server's own timezone, silently shifting the time).
            setStartsAtIso(value ? new Date(value).toISOString() : "");
          }}
        />
      </label>
      <input type="hidden" name="starts_at" value={startsAtIso} />

      {format === "online" && (
        <label className="mt-3 flex items-center gap-2 text-sm font-medium text-[var(--ink)]/80">
          <input
            type="checkbox"
            name="auto_meet"
            checked={autoMeet}
            onChange={(e) => setAutoMeet(e.target.checked)}
            className="h-4 w-4 accent-[var(--indigo)]"
          />
          {t("autoMeetLinkLabel")}
        </label>
      )}

      {(format !== "online" || !autoMeet) && (
        <label className={`mt-3 ${labelClasses}`}>
          {t(locationLabelKeys[format] ?? "locationFieldFallback")}{" "}
          <span className="text-xs font-normal text-[var(--ink)]/60">{t("optionalTag")}</span>
          <input
            type="text"
            name="location"
            placeholder={locationPlaceholders[format]}
            className={fieldClasses}
          />
        </label>
      )}

      {state.error && <p className="mt-3 text-sm text-[#a8371c]">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? t("addingGeneric") : t("addSlotAction")}
      </Button>
    </Card>
  );
}
