"use client";

import { useActionState } from "react";
import { sendMessage } from "./messages-actions";

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
  const boundSend = sendMessage.bind(null, applicationId, revalidatePath);
  const [state, formAction, pending] = useActionState(boundSend, {
    error: null,
  });

  return (
    <div className="mt-8">
      {messages.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No messages yet. Say hello to {otherPartyLabel}.
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
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-200 bg-white text-zinc-900"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {message.body}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      mine ? "text-white/50" : "text-zinc-400"
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
          placeholder={`Message ${otherPartyLabel}...`}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
        {state.error && (
          <p className="mt-2 text-sm text-red-600">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="mt-3 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {pending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
