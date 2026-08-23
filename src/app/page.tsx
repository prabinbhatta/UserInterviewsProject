"use client";

import Link from "next/link";
import { VoiceWaveform } from "./VoiceWaveform";
import { Reveal } from "./Reveal";
import { JourneyTimeline } from "./JourneyTimeline";
import { SiteHeader } from "./SiteHeader";
import { useLanguage } from "./LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  const steps = [
    { time: "00:00", title: t("step1Title"), body: t("step1Body") },
    { time: "00:15", title: t("step2Title"), body: t("step2Body") },
    { time: "01:30", title: t("step3Title"), body: t("step3Body") },
    { time: "02:00", title: t("step4Title"), body: t("step4Body") },
  ];

  return (
    <div className="flex flex-1 flex-col bg-[var(--paper)] font-[family-name:var(--font-manrope)] text-[var(--ink)]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative mx-auto w-full max-w-6xl overflow-hidden px-6 pt-8 pb-20 sm:px-10 sm:pt-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-32 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-[var(--coral)]/25 via-[var(--gold)]/15 to-transparent blur-3xl motion-safe:animate-[floatSlow_14s_ease-in-out_infinite]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-[var(--indigo)]/15 to-transparent blur-3xl motion-safe:animate-[floatSlow_18s_ease-in-out_infinite_reverse]"
        />
        <div className="relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="motion-safe:animate-[riseIn_0.7s_ease-out]">
            <p className="font-mono-utility text-xs uppercase tracking-[0.2em] text-[var(--coral)]">
              {t("heroKicker")}
            </p>
            <h1 className="font-serif-display mt-4 text-[2.5rem] leading-[1.08] font-medium tracking-tight sm:text-6xl">
              {t("heroTitleLead")}{" "}
              <span className="italic text-[var(--indigo)]">
                {t("heroTitleEmphasis")}
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--ink)]/75">
              {t("heroBody")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup?role=researcher"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--ink)] px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-[var(--indigo)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--coral)]"
              >
                {t("ctaResearcher")}
              </Link>
              <Link
                href="/signup?role=participant"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--ink)]/15 bg-white px-6 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-0.5 hover:border-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--coral)]"
              >
                {t("ctaParticipant")}
              </Link>
            </div>
          </div>

          <div className="motion-safe:animate-[riseIn_0.9s_ease-out]">
            <VoiceWaveform />
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section className="border-t border-[var(--mist)]/70 bg-white/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <Reveal>
            <h2 className="font-serif-display max-w-md text-3xl font-medium sm:text-4xl">
              {t("twoPathsTitle")}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal delay={80}>
              <div className="group h-full rounded-2xl border border-[var(--mist)] bg-[var(--indigo)] p-8 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(45,52,112,0.5)]">
                <p className="font-mono-utility text-xs uppercase tracking-widest text-white/60">
                  {t("forCompanies")}
                </p>
                <h3 className="font-serif-display mt-3 text-2xl font-medium">
                  {t("forCompaniesTitle")}
                </h3>
                <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-white/80">
                  <li>{t("forCompaniesLi1")}</li>
                  <li>{t("forCompaniesLi2")}</li>
                  <li>{t("forCompaniesLi3")}</li>
                </ul>
                <Link
                  href="/signup?role=researcher"
                  className="mt-8 inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-[var(--indigo)] transition-transform group-hover:-translate-y-0.5"
                >
                  {t("startStudy")}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="group h-full rounded-2xl border border-[var(--mist)] bg-[var(--gold)] p-8 text-[var(--ink)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(245,185,66,0.5)]">
                <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)]/60">
                  {t("forParticipants")}
                </p>
                <h3 className="font-serif-display mt-3 text-2xl font-medium">
                  {t("forParticipantsTitle")}
                </h3>
                <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-[var(--ink)]/80">
                  <li>{t("forParticipantsLi1")}</li>
                  <li>{t("forParticipantsLi2")}</li>
                  <li>{t("forParticipantsLi3")}</li>
                </ul>
                <Link
                  href="/signup?role=participant"
                  className="mt-8 inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-[var(--ink)] px-5 text-sm font-semibold text-white transition-transform group-hover:-translate-y-0.5"
                >
                  {t("browseStudies")}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <Reveal>
          <h2 className="font-serif-display max-w-md text-3xl font-medium sm:text-4xl">
            {t("journeyTitle")}
          </h2>
          <p className="mt-3 max-w-lg text-[var(--ink)]/70">{t("journeyBody")}</p>
        </Reveal>

        <Reveal delay={120}>
          <JourneyTimeline steps={steps} />
        </Reveal>
      </section>

      {/* Honest trust section */}
      <section className="border-t border-[var(--mist)]/70 bg-white/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <Reveal>
            <h2 className="font-serif-display max-w-lg text-3xl font-medium sm:text-4xl">
              {t("trustTitle")}
            </h2>
            <p className="mt-3 max-w-lg text-[var(--ink)]/70">{t("trustBody")}</p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Reveal delay={80} className="group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--coral)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h3 className="mt-4 font-semibold">{t("trust1Title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70">
                {t("trust1Body")}
              </p>
            </Reveal>
            <Reveal delay={180} className="group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--indigo)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h3 className="mt-4 font-semibold">{t("trust2Title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70">
                {t("trust2Body")}
              </p>
            </Reveal>
            <Reveal delay={280} className="group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h3 className="mt-4 font-semibold">{t("trust3Title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70">
                {t("trust3Body")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--mist)]/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)]/60">
            {t("footerTagline")}
          </p>
          <div className="flex items-center gap-4 text-sm text-[var(--ink)]/60">
            <Link href="/terms" className="underline decoration-[var(--mist)] underline-offset-4 hover:decoration-[var(--coral)]">
              {t("termsLink")}
            </Link>
            <Link href="/privacy" className="underline decoration-[var(--mist)] underline-offset-4 hover:decoration-[var(--coral)]">
              {t("privacyLink")}
            </Link>
            <span>&copy; {new Date().getFullYear()} — {t("brand")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
