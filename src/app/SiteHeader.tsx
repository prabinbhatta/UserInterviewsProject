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
      className={`sticky top-0 z-50 transition-all duration-300 ease-interact ${
        scrolled
          ? "border-b border-[var(--line)]/70 bg-[var(--paper)]/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2.5">
          <svg width="60" height="19" viewBox="0 0 70 22" fill="none" aria-hidden="true">
            <circle cx="7" cy="11" r="3.4" fill="var(--ink)" opacity="0.28" />
            <circle cx="18" cy="11" r="4.3" fill="var(--ink)" opacity="0.45" />
            <circle cx="31" cy="11" r="6.5" fill="var(--accent)" />
            <circle cx="31" cy="11" r="9" stroke="var(--accent)" strokeWidth="1.3" fill="none" />
            <circle cx="44" cy="11" r="4.3" fill="var(--ink)" opacity="0.45" />
            <circle cx="55" cy="11" r="3.4" fill="var(--ink)" opacity="0.28" />
          </svg>
          <span className="font-display text-[15px] font-semibold text-[var(--ink)]">
            {t("brand")}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center rounded-full border border-[var(--line)] p-0.5 font-mono-utility text-[11px] uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`rounded-full px-2.5 py-1 transition-colors duration-150 ease-interact ${
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
              className={`rounded-full px-2.5 py-1 transition-colors duration-150 ease-interact ${
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
            className="font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)] underline decoration-[var(--line)] underline-offset-4 transition-colors duration-150 ease-interact hover:decoration-[var(--accent)]"
          >
            {t("logIn")}
          </Link>
        </div>
      </header>
    </div>
  );
}
