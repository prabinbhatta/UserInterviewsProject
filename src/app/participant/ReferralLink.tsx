"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ReferralLink({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/signup?role=participant&ref=${userId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button type="button" onClick={copy} size="sm" className="mt-3">
      {copied ? "Copied!" : "Copy your invite link"}
    </Button>
  );
}
