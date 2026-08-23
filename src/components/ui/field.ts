// Shared className for text inputs, selects, and textareas — a plain
// string rather than a wrapper component, since call sites need to keep
// passing arbitrary native props (min, step, rows, accept, ...).
export const fieldClasses =
  "mt-1 w-full rounded-lg border border-[var(--mist)] bg-white px-3 py-2 text-[var(--ink)] focus:border-[var(--indigo)] focus:outline-none focus:ring-2 focus:ring-[var(--indigo)]/30";

export const labelClasses = "block text-sm font-medium text-[var(--ink)]/80";
