"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

const QUOTES = [
  { text: "I switched banking apps because checkout took four taps too many.", tag: "Fintech usability study · Kathmandu" },
  { text: "I'd use a grocery app daily if it remembered my usual order.", tag: "Grocery delivery study · Pokhara" },
  { text: "Honestly, I just want to know the price before I download anything.", tag: "Mobile pricing study · Lalitpur" },
];

// Deterministic bar heights (no Math.random — avoids SSR/client hydration
// mismatch) built from two overlaid sine waves so it reads as an organic
// waveform rather than a uniform bar chart.
const BAR_COUNT = 56;
const BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const a = Math.sin(i * 0.45) * 0.5 + 0.5;
  const b = Math.sin(i * 0.13 + 1.5) * 0.5 + 0.5;
  const height = 18 + (a * 0.6 + b * 0.4) * 74;
  return Math.round(height);
});

export function VoiceWaveform() {
  const { t } = useLanguage();
  const [active, setActive] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  function activate() {
    setQuoteIndex((i) => (i + 1) % QUOTES.length);
    setActive(true);
  }

  const quote = QUOTES[quoteIndex];

  return (
    <div className="w-full">
      <button
        type="button"
        onMouseEnter={activate}
        onFocus={activate}
        onClick={activate}
        aria-label={t("voicePlayAriaLabel")}
        className="group w-full cursor-pointer rounded-2xl border border-[var(--line)] bg-white/70 p-6 text-left shadow-[0_1px_0_rgba(18,22,29,0.04)] backdrop-blur-sm transition-colors duration-150 ease-interact hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      >
        <div className="flex h-20 items-end gap-[3px] sm:h-24">
          {BARS.map((h, i) => (
            <span
              key={i}
              style={{
                height: `${h}%`,
                animationDelay: `${(i % 12) * 70}ms`,
              }}
              className={`w-full min-w-[2px] rounded-full transition-colors duration-500 ease-interact motion-safe:duration-700 ${
                active
                  ? "bg-[var(--accent)] motion-safe:animate-[waveform_1.1s_ease-in-out_infinite]"
                  : "bg-[var(--navy)]/35 group-hover:bg-[var(--accent)]/70"
              }`}
            />
          ))}
        </div>

        <div className="mt-5 min-h-[3.25rem] border-t border-dashed border-[var(--line)] pt-4">
          <p
            key={active ? quoteIndex : "idle"}
            className={`font-display text-[1.05rem] leading-snug text-[var(--ink)] transition-opacity duration-500 sm:text-lg ${
              active ? "motion-safe:animate-[fadeIn_0.6s_ease-out]" : "opacity-60"
            }`}
          >
            {active ? `“${quote.text}”` : t("voiceHoverHint")}
          </p>
          {active && (
            <p className="mt-2 font-mono-utility text-xs tracking-wide text-[var(--navy)]/70 uppercase">
              {quote.tag}
            </p>
          )}
        </div>
      </button>
    </div>
  );
}
