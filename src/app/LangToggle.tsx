"use client";

import { useLanguage } from "./LanguageProvider";

export function LangToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-zinc-200 p-0.5 text-[11px] uppercase tracking-wider">
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "en"
            ? "bg-zinc-900 text-white"
            : "text-zinc-500 hover:text-zinc-900"
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
            ? "bg-zinc-900 text-white"
            : "text-zinc-500 hover:text-zinc-900"
        }`}
      >
        ने
      </button>
    </div>
  );
}
