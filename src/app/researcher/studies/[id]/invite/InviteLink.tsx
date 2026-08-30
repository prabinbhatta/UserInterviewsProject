"use client";

import { useState } from "react";
import { useLanguage } from "@/app/LanguageProvider";

export function InviteLink({ token }: { token: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/invite/${token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium text-[var(--ink)]/70 transition-colors hover:border-[var(--signal)] hover:text-[var(--ink)]"
    >
      {copied ? t("copiedLink") : t("copyLink")}
    </button>
  );
}
