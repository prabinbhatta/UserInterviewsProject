"use client";

import { useLanguage } from "./LanguageProvider";

export function LangToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-[var(--line)] p-0.5 text-[11px] uppercase tracking-wider">
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "en"
            ? "bg-[var(--ink)] text-white"
            : "text-[var(--ink)]/70 hover:text-[var(--ink)]"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ne")}
        aria-pressed={lang === "ne"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "ne"
            ? "bg-[var(--ink)] text-white"
            : "text-[var(--ink)]/70 hover:text-[var(--ink)]"
        }`}
      >
        ने
      </button>
    </div>
  );
}
