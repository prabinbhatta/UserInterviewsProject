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
    <svg width="26" height="18" viewBox="0 0 70 22" fill="none" aria-hidden="true">
      <circle cx="7" cy="11" r="3.4" fill="currentColor" opacity="0.28" />
      <circle cx="18" cy="11" r="4.3" fill="currentColor" opacity="0.45" />
      <circle cx="31" cy="11" r="6.5" fill="currentColor" />
      <circle cx="31" cy="11" r="9" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <circle cx="44" cy="11" r="4.3" fill="currentColor" opacity="0.45" />
      <circle cx="55" cy="11" r="3.4" fill="currentColor" opacity="0.28" />
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
      className="mx-2 hidden h-px flex-1 self-center bg-[repeating-linear-gradient(90deg,var(--line)_0,var(--line)_6px,transparent_6px,transparent_12px)] sm:block"
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
      iconClasses: "text-[var(--accent)] bg-[var(--accent)]/10",
    },
    {
      icon: <PlatformIcon />,
      label: step2,
      iconClasses: "text-[var(--navy)] bg-[var(--navy)]/10",
    },
    {
      icon: <VoiceIcon />,
      label: step3,
      iconClasses: "text-[var(--warning)] bg-[var(--warning)]/15",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-0">
      {nodes.map((node, i) => (
        <div key={node.label} className="flex w-full items-center sm:contents">
          <div className="flex flex-1 flex-col items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-6 py-6 text-center transition-transform duration-300 ease-interact hover:-translate-y-1">
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
