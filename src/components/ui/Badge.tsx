export type BadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "strong";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-[var(--mist)]/30 text-[var(--ink)]/70",
  info: "bg-[var(--indigo)]/10 text-[var(--indigo)]",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-[var(--gold)]/20 text-[#8a5a00]",
  danger: "bg-[var(--coral)]/15 text-[#a8371c]",
  strong: "bg-[var(--ink)] text-white",
};

export function Badge({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
