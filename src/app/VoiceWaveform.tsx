"use client";

import { useState } from "react";

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
        aria-label="Play a sample moment from a research session"
        className="group w-full cursor-pointer rounded-2xl border border-[var(--mist)] bg-white/70 p-6 text-left shadow-[0_1px_0_rgba(18,23,43,0.04)] backdrop-blur-sm transition-colors hover:border-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]"
      >
        <div className="flex h-20 items-end gap-[3px] sm:h-24">
          {BARS.map((h, i) => (
            <span
              key={i}
              style={{
                height: `${h}%`,
                animationDelay: `${(i % 12) * 70}ms`,
              }}
              className={`w-full min-w-[2px] rounded-full transition-colors duration-500 motion-safe:duration-700 ${
                active
                  ? "bg-[var(--coral)] motion-safe:animate-[waveform_1.1s_ease-in-out_infinite]"
                  : "bg-[var(--mist)] group-hover:bg-[var(--coral)]/60"
              }`}
            />
          ))}
        </div>

        <div className="mt-5 min-h-[3.25rem] border-t border-dashed border-[var(--mist)] pt-4">
          <p
            key={active ? quoteIndex : "idle"}
            className={`font-serif-display text-[1.05rem] leading-snug text-[var(--ink)] transition-opacity duration-500 sm:text-lg ${
              active ? "motion-safe:animate-[fadeIn_0.6s_ease-out]" : "opacity-60"
            }`}
          >
            {active ? `“${quote.text}”` : "Hover to hear a moment from a real session."}
          </p>
          {active && (
            <p className="mt-2 font-mono-utility text-xs tracking-wide text-[var(--indigo)]/70 uppercase">
              {quote.tag}
            </p>
          )}
        </div>
      </button>
    </div>
  );
}
