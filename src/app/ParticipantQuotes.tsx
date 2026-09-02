const QUOTES = [
  { text: "I switched banking apps because checkout took four taps too many.", tag: "Fintech usability study · Kathmandu" },
  { text: "I'd use a grocery app daily if it remembered my usual order.", tag: "Grocery delivery study · Pokhara" },
  { text: "Honestly, I just want to know the price before I download anything.", tag: "Mobile pricing study · Lalitpur" },
];

function QuoteMark() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
      <path
        d="M0 16V9.6C0 4.3 3.1 1 8.8 0l1 2.6C6.4 3.7 4.8 5.7 4.6 8.4H9V16H0ZM12.2 16V9.6c0-5.3 3.1-8.6 8.8-9.6l1 2.6c-3.4 1.1-5 3.1-5.2 5.8H21V16h-8.8Z"
        fill="var(--accent)"
      />
    </svg>
  );
}

// Real proof, without an audio metaphor — the earlier version of this
// (an audio waveform, "hover to hear") was real feedback in itself: shown
// cold, it made the site read as a voice/translation product. Same
// quotes, same purpose (this platform produces real quotes from real
// people), told as plain text instead.
export function ParticipantQuotes() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {QUOTES.map((quote) => (
        <div
          key={quote.tag}
          className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[0_1px_3px_rgba(18,22,29,0.05)]"
        >
          <QuoteMark />
          <p className="font-display mt-3 text-[15px] leading-snug text-[var(--ink)]">
            {quote.text}
          </p>
          <p className="mt-3 font-mono-utility text-[10.5px] uppercase tracking-wide text-[var(--ink)]/50">
            {quote.tag}
          </p>
        </div>
      ))}
    </div>
  );
}
