export type NoticeTone = "success" | "danger";

const TONES: Record<NoticeTone, string> = {
  success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  danger: "bg-[var(--danger)]/10 text-[#a8371c] border border-[var(--danger)]/20",
};

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.5 12.5l2.4 2.4L16 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="1" fill="currentColor" />
    </svg>
  );
}

export function Notice({
  tone,
  children,
  className = "",
}: {
  tone: NoticeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm leading-relaxed ${TONES[tone]} ${className}`}
    >
      <span className="mt-0.5 shrink-0">
        {tone === "success" ? <CheckCircleIcon /> : <AlertCircleIcon />}
      </span>
      <span>{children}</span>
    </div>
  );
}
