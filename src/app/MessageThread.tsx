"use client";

import { useActionState } from "react";
import { sendMessage } from "./messages-actions";
import { useLanguage } from "./LanguageProvider";
import { Button } from "@/components/ui/Button";
import { fieldClasses } from "@/components/ui/field";

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export function MessageThread({
  applicationId,
  revalidatePath,
  currentUserId,
  otherPartyLabel,
  messages,
}: {
  applicationId: string;
  revalidatePath: string;
  currentUserId: string;
  otherPartyLabel: string;
  messages: Message[];
}) {
  const { t } = useLanguage();
  const boundSend = sendMessage.bind(null, applicationId, revalidatePath);
  const [state, formAction, pending] = useActionState(boundSend, {
    error: null,
  });

  return (
    <div className="mt-8">
      {messages.length === 0 ? (
        <p className="text-sm text-[var(--ink)]/70">
          {t("sayHelloPrefix")} {otherPartyLabel}.
        </p>
      ) : (
        <ul className="space-y-3">
          {messages.map((message) => {
            const mine = message.sender_id === currentUserId;
            return (
              <li
                key={message.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    mine
                      ? "bg-[var(--ink)] text-white"
                      : "border border-[var(--line)] bg-white text-[var(--ink)]"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {message.body}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      mine ? "text-white/50" : "text-[var(--ink)]/60"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <form action={formAction} className="mt-6">
        <textarea
          name="body"
          required
          rows={3}
          placeholder={`${t("messageAction")} ${otherPartyLabel}...`}
          className={fieldClasses}
        />
        {state.error && (
          <p className="mt-2 text-sm text-[#a8371c]">{state.error}</p>
        )}
        <Button type="submit" disabled={pending} className="mt-3">
          {pending ? t("sendingGeneric") : t("sendAction")}
        </Button>
      </form>
    </div>
  );
}
