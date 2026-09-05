"use client";

import Link from "next/link";
import { LinkButton } from "@/components/ui/LinkButton";
import { StudyPreviewCard } from "./StudyPreviewCard";
import { ParticipantQuotes } from "./ParticipantQuotes";
import { Reveal } from "./Reveal";
import { JourneyTimeline } from "./JourneyTimeline";
import { PlatformFlow } from "./PlatformFlow";
import { ScreenerIcon, CalendarIcon, PaymentCheckIcon, BuildingIcon, SpeechIcon } from "./TrustIcons";
import { SiteHeader } from "./SiteHeader";
import { useLanguage } from "./LanguageProvider";
import { SplitReveal } from "./SplitReveal";
import { Magnetic } from "./Magnetic";
import { Tilt } from "./Tilt";
import { PanelIllustration } from "./PanelIllustration";

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
        <div className="relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="motion-safe:animate-[fadeIn_0.5s_ease-out]">
            <p className="font-mono-utility text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              {t("heroKicker")}
            </p>
            <h1 className="font-display mt-4 text-[2.5rem] font-medium sm:text-6xl">
              <SplitReveal text={t("heroTitleLead")} />{" "}
              <SplitReveal
                text={t("heroTitleEmphasis")}
                className="text-[var(--accent)]"
                startDelay={280}
              />
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--ink)]/75">
              {t("heroBody")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Magnetic>
                <LinkButton href="/signup?role=researcher" variant="primary">
                  {t("ctaResearcher")}
                </LinkButton>
              </Magnetic>
              <Magnetic>
                <LinkButton href="/signup?role=participant" variant="secondary">
                  {t("ctaParticipant")}
                </LinkButton>
              </Magnetic>
            </div>
          </div>

          <div className="motion-safe:animate-[riseIn_0.9s_ease-out]">
            <StudyPreviewCard />
          </div>
        </div>
      </section>

      {/* Panel illustration — a visual break stating the mechanic before the flow explains it */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-14 sm:px-10">
        <Reveal>
          <PanelIllustration />
        </Reveal>
      </section>

      {/* Platform flow — what this actually is, at a glance */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-10">
        <Reveal delay={160}>
          <PlatformFlow
            step1={t("flowStep1Label")}
            step2={t("flowStep2Label")}
            step3={t("flowStep3Label")}
          />
        </Reveal>
      </section>

      {/* Two paths */}
      <section className="border-t border-[var(--line)]/70 bg-white/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <Reveal>
            <h2 className="font-display max-w-md text-3xl font-medium sm:text-4xl">
              {t("twoPathsTitle")}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal delay={80}>
              <Tilt max={5} className="group h-full">
                <div className="h-full rounded-2xl border border-[var(--line)] bg-[var(--navy)] p-8 text-white shadow-[0_1px_3px_rgba(18,22,29,0.05)] transition-shadow duration-300 ease-interact group-hover:shadow-[0_24px_44px_-18px_rgba(27,47,69,0.6)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <BuildingIcon />
                </div>
                <p className="mt-4 font-mono-utility text-xs uppercase tracking-widest text-white/60">
                  {t("forCompanies")}
                </p>
                <h3 className="font-display mt-3 text-2xl font-medium">
                  {t("forCompaniesTitle")}
                </h3>
                <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-white/80">
                  <li>{t("forCompaniesLi1")}</li>
                  <li>{t("forCompaniesLi2")}</li>
                  <li>{t("forCompaniesLi3")}</li>
                </ul>
                <Link
                  href="/signup?role=researcher"
                  className="mt-8 inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-[var(--navy)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.2)] transition-all duration-150 ease-interact group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_20px_-6px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.97] active:shadow-[0_2px_4px_-2px_rgba(0,0,0,0.2)]"
                >
                  {t("startStudy")}
                  <span aria-hidden="true" className="transition-transform duration-150 ease-interact group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                </div>
              </Tilt>
            </Reveal>

            <Reveal delay={200}>
              <Tilt max={5} className="group h-full">
                <div className="h-full rounded-2xl border border-[var(--line)] bg-[var(--warning)] p-8 text-[var(--ink)] shadow-[0_1px_3px_rgba(18,22,29,0.05)] transition-shadow duration-300 ease-interact group-hover:shadow-[0_24px_44px_-18px_rgba(201,147,15,0.55)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50">
                  <SpeechIcon />
                </div>
                <p className="mt-4 font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)]/60">
                  {t("forParticipants")}
                </p>
                <h3 className="font-display mt-3 text-2xl font-medium">
                  {t("forParticipantsTitle")}
                </h3>
                <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-[var(--ink)]/80">
                  <li>{t("forParticipantsLi1")}</li>
                  <li>{t("forParticipantsLi2")}</li>
                  <li>{t("forParticipantsLi3")}</li>
                </ul>
                <Link
                  href="/signup?role=participant"
                  className="mt-8 inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-[var(--ink)] px-5 text-sm font-semibold text-white shadow-[0_2px_8px_-2px_rgba(18,22,29,0.35)] transition-all duration-150 ease-interact group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_20px_-6px_rgba(18,22,29,0.4)] active:translate-y-0 active:scale-[0.97] active:shadow-[0_2px_4px_-2px_rgba(18,22,29,0.3)]"
                >
                  {t("browseStudies")}
                  <span aria-hidden="true" className="transition-transform duration-150 ease-interact group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                </div>
              </Tilt>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <Reveal>
          <h2 className="font-display max-w-md text-3xl font-medium sm:text-4xl">
            {t("journeyTitle")}
          </h2>
          <p className="mt-3 max-w-lg text-[var(--ink)]/70">{t("journeyBody")}</p>
        </Reveal>

        <Reveal delay={120}>
          <JourneyTimeline steps={steps} />
        </Reveal>
      </section>

      {/* Honest trust section */}
      <section className="border-t border-[var(--line)]/70 bg-white/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <Reveal>
            <h2 className="font-display max-w-lg text-3xl font-medium sm:text-4xl">
              {t("trustTitle")}
            </h2>
            <p className="mt-3 max-w-lg text-[var(--ink)]/70">{t("trustBody")}</p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Reveal delay={80} className="group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] transition-transform duration-300 ease-interact group-hover:scale-110 group-hover:rotate-6">
                <ScreenerIcon />
              </div>
              <h3 className="mt-4 font-semibold">{t("trust1Title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70">
                {t("trust1Body")}
              </p>
            </Reveal>
            <Reveal delay={180} className="group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--navy)] transition-transform duration-300 ease-interact group-hover:scale-110 group-hover:rotate-6">
                <CalendarIcon />
              </div>
              <h3 className="mt-4 font-semibold">{t("trust2Title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70">
                {t("trust2Body")}
              </p>
            </Reveal>
            <Reveal delay={280} className="group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--warning)] transition-transform duration-300 ease-interact group-hover:scale-110 group-hover:rotate-6">
                <PaymentCheckIcon />
              </div>
              <h3 className="mt-4 font-semibold">{t("trust3Title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70">
                {t("trust3Body")}
              </p>
            </Reveal>
          </div>

          <Reveal delay={340} className="mt-10">
            <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)]/50">
              One more thing — don&apos;t take our word for it
            </p>
            <div className="mt-3">
              <ParticipantQuotes />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--line)]/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)]/60">
            {t("footerTagline")}
          </p>
          <div className="flex items-center gap-4 text-sm text-[var(--ink)]/60">
            <Link href="/faq" className="underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--accent)]">
              {t("faqLink")}
            </Link>
            <Link href="/terms" className="underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--accent)]">
              {t("termsLink")}
            </Link>
            <Link href="/privacy" className="underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--accent)]">
              {t("privacyLink")}
            </Link>
            <span>&copy; {new Date().getFullYear()} — {t("brand")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
