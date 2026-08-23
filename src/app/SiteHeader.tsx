"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--mist)]/70 bg-[var(--paper)]/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <svg width="26" height="18" viewBox="0 0 26 18" fill="none" aria-hidden="true">
            <rect x="0" y="6" width="3" height="6" rx="1.5" fill="var(--coral)" />
            <rect x="6" y="2" width="3" height="14" rx="1.5" fill="var(--ink)" />
            <rect x="12" y="0" width="3" height="18" rx="1.5" fill="var(--indigo)" />
            <rect x="18" y="4" width="3" height="10" rx="1.5" fill="var(--ink)" />
            <rect x="23" y="7" width="3" height="4" rx="1.5" fill="var(--coral)" />
          </svg>
          <span className="font-mono-utility text-xs uppercase tracking-widest text-[var(--indigo)]">
            {t("brand")}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center rounded-full border border-[var(--mist)] p-0.5 font-mono-utility text-[11px] uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                lang === "en"
                  ? "bg-[var(--ink)] text-white"
                  : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
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
                  : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
              }`}
            >
              ने
            </button>
          </div>
          <Link
            href="/login"
            className="font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)] underline decoration-[var(--mist)] underline-offset-4 transition-colors hover:decoration-[var(--coral)]"
          >
            {t("logIn")}
          </Link>
        </div>
      </header>
    </div>
  );
}
