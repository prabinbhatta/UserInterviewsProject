"use client";

import { useActionState } from "react";
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

  return (
    <Card as="form" action={formAction}>
      <label className={labelClasses}>
        {t("addTimeSlotFieldLabel")}
        <input
          type="datetime-local"
          name="starts_at"
          required
          className={fieldClasses}
        />
      </label>

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

      {state.error && <p className="mt-3 text-sm text-[#a8371c]">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? t("addingGeneric") : t("addSlotAction")}
      </Button>
    </Card>
  );
}
