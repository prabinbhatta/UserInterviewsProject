// The PanelMeet mark: two overlapping speech-bubble tiles — researcher
// and participant, meeting in the middle. One shared component so every
// placement (header, favicon reuse in PlatformFlow, future spots) stays
// in sync instead of each one hand-rolling its own copy of the SVG.
//
// The paper-colored outline on the front bubble isn't decorative — it's
// what keeps the two shapes reading as distinct once this gets shrunk to
// favicon size instead of blurring into one blob.
//
// `mono` renders both bubbles in currentColor (for contexts already
// inside a colored badge/icon circle, e.g. PlatformFlow) and drops the
// separating outline, since there's no fixed background color to punch
// through with there. The default duotone version — navy back bubble,
// accent front bubble — is the one that reads as "the logo."

export function LogoMark({
  size = 22,
  mono = false,
  className = "",
}: {
  size?: number;
  mono?: boolean;
  className?: string;
}) {
  const back = mono ? "currentColor" : "var(--navy)";
  const front = mono ? "currentColor" : "var(--accent)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="8" y="19" width="53" height="42" rx="14" fill={back} />
      <path d="M18 61 Q13 71 10 78 Q21 74 31 61 Z" fill={back} />
      <rect
        x="35"
        y="35"
        width="53"
        height="42"
        rx="14"
        fill={front}
        opacity={mono ? 0.6 : 1}
        stroke={mono ? "none" : "var(--paper)"}
        strokeWidth={mono ? 0 : 3}
      />
      <path
        d="M76 77 Q81 87 84 94 Q73 90 63 77 Z"
        fill={front}
        opacity={mono ? 0.6 : 1}
        stroke={mono ? "none" : "var(--paper)"}
        strokeWidth={mono ? 0 : 3}
        strokeLinejoin="round"
      />
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
