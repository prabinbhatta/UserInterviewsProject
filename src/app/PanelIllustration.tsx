export function PanelIllustration() {
  return (
    <svg
      viewBox="0 0 320 70"
      className="mx-auto h-auto w-full max-w-md text-[var(--ink)]"
      fill="none"
      aria-hidden="true"
    >
      <line x1="150" y1="35" x2="107" y2="27" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
      <line x1="150" y1="35" x2="196" y2="41" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />

      <circle cx="20" cy="44" r="6" fill="currentColor" opacity="0.14" />
      <circle cx="55" cy="20" r="8" fill="currentColor" opacity="0.2" />
      <circle cx="107" cy="27" r="10" fill="currentColor" opacity="0.3" />

      <circle cx="150" cy="35" r="15" fill="var(--accent)" className="animate-[panelPulse_3.2s_ease-in-out_infinite]" style={{ transformOrigin: "150px 35px" }} />
      <circle cx="150" cy="35" r="21" stroke="var(--accent)" strokeWidth="1.6" fill="none" opacity="0.5" />

      <circle cx="196" cy="41" r="10" fill="currentColor" opacity="0.3" />
      <circle cx="248" cy="17" r="8" fill="currentColor" opacity="0.2" />
      <circle cx="288" cy="46" r="6" fill="currentColor" opacity="0.14" />
    </svg>
  );
}
