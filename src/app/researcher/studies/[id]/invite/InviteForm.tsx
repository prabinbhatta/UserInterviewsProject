"use client";

import { useActionState } from "react";
import { createInvites } from "./actions";
import { useLanguage } from "@/app/LanguageProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

export function InviteForm({ studyId }: { studyId: string }) {
  const { t } = useLanguage();
  const boundCreate = createInvites.bind(null, studyId);
  const [state, formAction, pending] = useActionState(boundCreate, {
    error: null,
  });

  return (
    <Card as="form" action={formAction}>
      <label className={labelClasses}>
        {t("inviteByEmailFieldLabel")}
        <textarea
          name="emails"
          required
          rows={4}
          placeholder={t("inviteByEmailPlaceholder")}
          className={fieldClasses}
        />
      </label>
      <p className="mt-1.5 text-xs text-[var(--ink)]/70">
        {t("inviteByEmailHint")}
      </p>

      {state.error && <p className="mt-3 text-sm text-[#a8371c]">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? t("generatingGeneric") : t("generateInviteLinksAction")}
      </Button>
    </Card>
  );
}
