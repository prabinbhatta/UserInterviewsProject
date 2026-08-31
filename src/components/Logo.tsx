// The PanelMeet mark: a row of dots (a panel of applicants) with the
// center one solid-filled and ringed — the active-speaker convention
// from video calls (a meet). One shared component so every placement
// (header, favicon reuse in PlatformFlow, future spots) stays in sync
// instead of each one hand-rolling its own copy of the same SVG.
//
// `mono` renders every dot in currentColor (for contexts already inside
// a colored badge/icon circle, e.g. PlatformFlow). The default duotone
// version uses ink for the outer dots and the brand accent for the
// match — this is the one that reads as "the logo."

const DOTS = [
  { cx: 7, r: 3.4, opacity: 0.32 },
  { cx: 18, r: 4.4, opacity: 0.52 },
  { cx: 44, r: 4.4, opacity: 0.52 },
  { cx: 55, r: 3.4, opacity: 0.32 },
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
      width={size * (70 / 22)}
      height={size}
      viewBox="0 0 70 22"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {DOTS.map((dot) => (
        <circle key={dot.cx} cx={dot.cx} cy={11} r={dot.r} fill={dotFill} opacity={mono ? dot.opacity : dot.opacity} />
      ))}
      <circle cx={31} cy={11} r={6.5} fill={matchFill} />
      <circle cx={31} cy={11} r={9.2} stroke={matchFill} strokeWidth={1.5} fill="none" />
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
