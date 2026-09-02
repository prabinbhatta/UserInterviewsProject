import { LogoMark } from "@/components/Logo";

const CRITERIA = [
  "Uses a banking app weekly",
  "Based in Kathmandu Valley",
  "Age 22–45",
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12l4.5 4.5L19 7"
        stroke="var(--accent)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// The literal thing this platform is: a study, a screener that actually
// filters, and a panel of applicants who matched — shown, not described.
// Placed in the hero specifically to replace an audio-waveform visual
// that (per real designer feedback) read as a voice/translation product
// rather than a research-recruiting one.
export function StudyPreviewCard() {
  return (
    <div className="w-full rounded-2xl border border-[var(--line)] bg-white/70 p-6 shadow-[0_1px_0_rgba(18,22,29,0.04)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono-utility text-[11px] uppercase tracking-widest text-[var(--ink)]/50">
            Study preview
          </p>
          <h3 className="font-display mt-1 text-lg font-medium text-[var(--ink)]">
            Mobile banking app — usability test
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--accent)]/12 px-3 py-1 font-mono-utility text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Active
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--ink)]/70">
        <span className="rounded-full border border-[var(--line)] px-2.5 py-1">Online</span>
        <span className="rounded-full border border-[var(--line)] px-2.5 py-1">45 min</span>
        <span className="rounded-full border border-[var(--line)] px-2.5 py-1">NPR 1,500</span>
      </div>

      <div className="mt-5 border-t border-dashed border-[var(--line)] pt-4">
        <p className="font-mono-utility text-[11px] uppercase tracking-widest text-[var(--ink)]/50">
          Screener — matched automatically
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {CRITERIA.map((c) => (
            <li key={c} className="flex items-center gap-2 text-sm text-[var(--ink)]/80">
              <CheckIcon />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex items-center gap-2.5 border-t border-dashed border-[var(--line)] pt-4">
        <LogoMark size={16} />
        <p className="text-sm text-[var(--ink)]/70">
          <span className="font-medium text-[var(--ink)]">6 screened in</span> of 18 applicants
        </p>
      </div>
    </div>
  );
}
