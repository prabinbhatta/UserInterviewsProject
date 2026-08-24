"use client";

function ClipboardIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="4" width="12" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9 4V3.5C9 2.67 9.67 2 10.5 2h3c.83 0 1.5.67 1.5 1.5V4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9 11.5l1.8 1.8L15.5 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PlatformIcon() {
  return (
    <svg width="26" height="18" viewBox="0 0 26 18" fill="none" aria-hidden="true">
      <rect x="0" y="6" width="3" height="6" rx="1.5" fill="currentColor" />
      <rect x="6" y="2" width="3" height="14" rx="1.5" fill="currentColor" />
      <rect x="12" y="0" width="3" height="18" rx="1.5" fill="currentColor" />
      <rect x="18" y="4" width="3" height="10" rx="1.5" fill="currentColor" />
      <rect x="23" y="7" width="3" height="4" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function VoiceIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6 11a6 6 0 0 0 12 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M12 17v3.5M9 20.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Connector() {
  return (
    <div
      aria-hidden="true"
      className="mx-2 hidden h-px flex-1 self-center bg-[repeating-linear-gradient(90deg,var(--mist)_0,var(--mist)_6px,transparent_6px,transparent_12px)] sm:block"
    />
  );
}

export function PlatformFlow({
  step1,
  step2,
  step3,
}: {
  step1: string;
  step2: string;
  step3: string;
}) {
  const nodes = [
    {
      icon: <ClipboardIcon />,
      label: step1,
      iconClasses: "text-[var(--coral)] bg-[var(--coral)]/10",
    },
    {
      icon: <PlatformIcon />,
      label: step2,
      iconClasses: "text-[var(--indigo)] bg-[var(--indigo)]/10",
    },
    {
      icon: <VoiceIcon />,
      label: step3,
      iconClasses: "text-[var(--gold)] bg-[var(--gold)]/15",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-0">
      {nodes.map((node, i) => (
        <div key={node.label} className="flex w-full items-center sm:contents">
          <div className="flex flex-1 flex-col items-center gap-3 rounded-2xl border border-[var(--mist)] bg-white px-6 py-6 text-center transition-transform duration-300 hover:-translate-y-1">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${node.iconClasses}`}
            >
              {node.icon}
            </div>
            <p className="text-sm font-medium text-[var(--ink)]">{node.label}</p>
          </div>
          {i < nodes.length - 1 && <Connector />}
        </div>
      ))}
    </div>
  );
}
