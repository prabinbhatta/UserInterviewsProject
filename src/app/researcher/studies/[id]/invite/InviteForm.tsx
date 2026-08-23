"use client";

import { useActionState } from "react";
import { createInvites } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

export function InviteForm({ studyId }: { studyId: string }) {
  const boundCreate = createInvites.bind(null, studyId);
  const [state, formAction, pending] = useActionState(boundCreate, {
    error: null,
  });

  return (
    <Card as="form" action={formAction}>
      <label className={labelClasses}>
        Invite by email
        <textarea
          name="emails"
          required
          rows={4}
          placeholder={"One email per line, or comma-separated —\nramesh@bank.com, sita@bank.com"}
          className={fieldClasses}
        />
      </label>
      <p className="mt-1.5 text-xs text-[var(--ink)]/70">
        Each address gets its own private link below — copy and send it
        however you&apos;d like. Anyone who opens it and signs up (or logs
        in) joins this study automatically, skipping the screener.
      </p>

      {state.error && <p className="mt-3 text-sm text-[#a8371c]">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? "Generating..." : "Generate invite links"}
      </Button>
    </Card>
  );
}
