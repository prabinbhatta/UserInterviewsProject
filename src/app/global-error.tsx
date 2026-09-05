"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Space_Grotesk, Manrope } from "next/font/google";
import { buttonClasses } from "@/components/ui/buttonStyles";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["600"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "600"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--paper)] px-6 text-center">
        <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)]/50">
          PanelMeet
        </p>
        <h1 className="font-display text-2xl font-medium text-[var(--ink)]">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm text-[var(--ink)]/70">
          We&apos;ve been notified and are looking into it. Try reloading the
          page — if it keeps happening, contact support at +977-9715633635.
        </p>
        <button onClick={() => reset()} className={buttonClasses("primary", "md")}>
          Try again
        </button>
      </body>
    </html>
  );
}
