export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";

const BASE =
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--coral)]";

const SIZES: Record<ButtonSize, string> = {
  md: "h-11 px-6 text-sm",
  sm: "h-9 px-4 text-sm",
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-[var(--ink)] text-white hover:bg-[var(--indigo)] hover:-translate-y-0.5",
  secondary:
    "border border-[var(--ink)]/15 bg-white text-[var(--ink)] hover:border-[var(--coral)] hover:-translate-y-0.5",
  ghost: "text-[var(--ink)]/70 underline underline-offset-4 decoration-[var(--mist)] hover:text-[var(--coral)] hover:decoration-[var(--coral)]",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
): string {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`.trim();
}
