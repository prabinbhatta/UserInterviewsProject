// The PanelMeet mark: five dots arranged in a circle — a panel, seats
// around a table — with the top one solid-filled and ringed: the match,
// the active-speaker convention from video calls. One shared component
// so every placement (header, favicon, PlatformFlow) stays in sync
// instead of each one hand-rolling its own copy of the SVG.
//
// This replaced an earlier two-speech-bubble mark after real feedback:
// shown cold to a designer, the site read as a voice/translation product
// rather than a research-recruiting one — the speech-bubble icon is the
// universal shorthand for chat/translate apps, and paired with the
// hero's audio waveform and "voice"-heavy copy, it was actively
// misleading. A circle of people has no audio or chat connotation at
// all; it just says "panel."
//
// `mono` renders every dot in currentColor (for contexts already inside
// a colored badge/icon circle, e.g. PlatformFlow). The default duotone
// version — ink dots, accent match — is the one that reads as "the
// logo."

const DOTS: { cx: number; cy: number }[] = [
  { cx: 76, cy: 39 },
  { cx: 66, cy: 72 },
  { cx: 30, cy: 72 },
  { cx: 20, cy: 39 },
];

export function LogoMark({
  size = 22,
  mono = false,
  className = "",
}: {
  size?: number;
  mono?: boolean;
  className?: string;
}) {
  const dotFill = mono ? "currentColor" : "var(--ink)";
  const matchFill = mono ? "currentColor" : "var(--accent)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {DOTS.map((dot) => (
        <circle
          key={`${dot.cx}-${dot.cy}`}
          cx={dot.cx}
          cy={dot.cy}
          r={8}
          fill={dotFill}
          opacity={mono ? 0.55 : 0.85}
        />
      ))}
      <circle cx={48} cy={18} r={8} fill={matchFill} />
      <circle cx={48} cy={18} r={13} stroke={matchFill} strokeWidth={2} fill="none" />
    </svg>
  );
}

export function Logo({
  wordmark,
  size = 22,
  className = "",
  wordmarkClassName = "font-display text-[15px] font-semibold text-[var(--ink)]",
}: {
  wordmark: string;
  size?: number;
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span className={wordmarkClassName}>{wordmark}</span>
    </span>
  );
}
