"use client";

import { useRouter } from "next/navigation";
import { mutedLinkClasses } from "@/components/ui/link";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`text-sm ${mutedLinkClasses}`}
    >
      Back
    </button>
  );
}
