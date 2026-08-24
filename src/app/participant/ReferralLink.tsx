"use client";

import { useState } from "react";

export function ReferralLink({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/signup?role=participant&ref=${userId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="mt-3 inline-flex items-center justify-center rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--indigo)] hover:-translate-y-0.5"
    >
      {copied ? "Copied!" : "Copy your invite link"}
    </button>
  );
}
