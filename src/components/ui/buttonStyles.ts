export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";

const BASE =
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-150 ease-interact disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none disabled:hover:translate-y-0 disabled:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:scale-[0.97]";

const SIZES: Record<ButtonSize, string> = {
  md: "h-11 px-6 text-sm",
  sm: "h-9 px-4 text-sm",
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--ink)] text-white shadow-[0_2px_10px_-2px_rgba(18,22,29,0.45)] hover:bg-[var(--navy)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-6px_rgba(27,47,69,0.5)] active:translate-y-0 active:shadow-[0_2px_6px_-2px_rgba(18,22,29,0.4)]",
  secondary:
    "border border-[var(--ink)]/15 bg-white text-[var(--ink)] shadow-[0_1px_3px_rgba(18,22,29,0.06)] hover:border-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(18,22,29,0.18)] active:translate-y-0 active:shadow-[0_1px_2px_rgba(18,22,29,0.06)]",
  ghost:
    "text-[var(--ink)]/70 underline underline-offset-4 decoration-[var(--line)] hover:text-[var(--accent)] hover:decoration-[var(--accent)] active:opacity-70",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
): string {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`.trim();
}
