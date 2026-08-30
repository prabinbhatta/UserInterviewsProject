"use client";

import { useActionState, useState } from "react";
import { inviteParticipant, type InviteParticipantState } from "./actions";
import { Button } from "@/components/ui/Button";

const initialState: InviteParticipantState = { error: null, invitedToken: null };

export function InviteButton({
  studyId,
  participantId,
}: {
  studyId: string;
  participantId: string;
}) {
  const boundInvite = inviteParticipant.bind(null, studyId, participantId);
  const [state, formAction, pending] = useActionState(boundInvite, initialState);
  const [copied, setCopied] = useState(false);

  if (state.invitedToken) {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${state.invitedToken}`;
    return (
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="shrink-0 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-medium text-[var(--ink)]/70 transition-colors duration-150 ease-interact hover:border-[var(--accent)] hover:text-[var(--ink)]"
      >
        {copied ? "Copied!" : "Copy invite link"}
      </button>
    );
  }

  return (
    <form action={formAction}>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Inviting..." : "Invite"}
      </Button>
      {state.error && <p className="mt-1 text-xs text-[#a8371c]">{state.error}</p>}
    </form>
  );
}
