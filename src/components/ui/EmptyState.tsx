function EmptyIllustration() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className="mx-auto"
    >
      <circle cx="48" cy="48" r="44" fill="var(--mist)" fillOpacity="0.25" />
      <rect
        x="26"
        y="34"
        width="44"
        height="32"
        rx="6"
        fill="white"
        stroke="var(--mist)"
        strokeWidth="2"
      />
      <path
        d="M26 40 L48 54 L70 40"
        stroke="var(--indigo)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="66" cy="30" r="7" fill="var(--coral)" />
      <path
        d="M63 30 L65.2 32.2 L69.5 27.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-[var(--mist)] px-6 py-12 text-center">
      <EmptyIllustration />
      <p className="mt-4 font-medium text-[var(--ink)]">{title}</p>
      {body && <p className="mt-1.5 max-w-sm text-sm text-[var(--ink)]/70">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
