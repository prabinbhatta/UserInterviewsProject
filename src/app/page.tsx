import Link from "next/link";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import { VoiceWaveform } from "./VoiceWaveform";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

const steps = [
  {
    time: "00:00",
    title: "Post a study & screener",
    body: "Pick a format, write your screener questions, and mark which answers qualify. That logic runs itself from here on.",
  },
  {
    time: "00:15",
    title: "Applicants get matched",
    body: "Everyone who answers is auto-screened on the spot. Anyone who gives a disqualifying answer never reaches your inbox.",
  },
  {
    time: "01:30",
    title: "Approve & schedule",
    body: "Review who's left, approve who fits, and share open times. They pick the slot that works — no email thread required.",
  },
  {
    time: "02:00",
    title: "Talk, then pay",
    body: "Run the session however you run sessions. Verify their payment screenshot, mark it paid, and you're done.",
  },
];

export default function Home() {
  return (
    <div
      style={
        {
          "--paper": "#F6F7FB",
          "--ink": "#12172B",
          "--indigo": "#2D3470",
          "--coral": "#FF6B4A",
          "--gold": "#F5B942",
          "--mist": "#C7CCE0",
        } as React.CSSProperties
      }
      className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable} flex flex-1 flex-col bg-[var(--paper)] font-[family-name:var(--font-manrope)] text-[var(--ink)]`}
    >
      {/* Header */}
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
            Research Platform
          </span>
        </div>
        <Link
          href="/login"
          className="font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)] underline decoration-[var(--mist)] underline-offset-4 transition-colors hover:decoration-[var(--coral)]"
        >
          Log in
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-8 pb-20 sm:px-10 sm:pt-14">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="motion-safe:animate-[riseIn_0.7s_ease-out]">
            <p className="font-mono-utility text-xs uppercase tracking-[0.2em] text-[var(--coral)]">
              User research · Starting in Nepal
            </p>
            <h1 className="font-serif-display mt-4 text-[2.5rem] leading-[1.08] font-medium tracking-tight sm:text-6xl">
              Every great insight starts as{" "}
              <span className="italic text-[var(--indigo)]">someone&rsquo;s voice.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--ink)]/75">
              Post a study, get matched with real people ready to talk, and
              pay them directly once it&rsquo;s done — screened, scheduled,
              and verified, without the back-and-forth.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup?role=researcher"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--ink)] px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-[var(--indigo)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--coral)]"
              >
                I need user research
              </Link>
              <Link
                href="/signup?role=participant"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--ink)]/15 bg-white px-6 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-0.5 hover:border-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--coral)]"
              >
                I want to share my voice
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
          <h2 className="font-serif-display max-w-md text-3xl font-medium sm:text-4xl">
            Two sides. One conversation.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--mist)] bg-[var(--indigo)] p-8 text-white">
              <p className="font-mono-utility text-xs uppercase tracking-widest text-white/60">
                For companies
              </p>
              <h3 className="font-serif-display mt-3 text-2xl font-medium">
                Teams who build things people use
              </h3>
              <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-white/80">
                <li>A screener that actually disqualifies bad-fit applicants — automatically.</li>
                <li>A review queue of people who already match your criteria.</li>
                <li>Scheduling that doesn&rsquo;t live in your email.</li>
              </ul>
              <Link
                href="/signup?role=researcher"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[var(--indigo)] transition-transform hover:-translate-y-0.5"
              >
                Start a study
              </Link>
            </div>

            <div className="rounded-2xl border border-[var(--mist)] bg-[var(--gold)] p-8 text-[var(--ink)]">
              <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)]/60">
                For participants
              </p>
              <h3 className="font-serif-display mt-3 text-2xl font-medium">
                People with opinions worth paying for
              </h3>
              <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-[var(--ink)]/80">
                <li>Apply to studies that actually fit your background.</li>
                <li>Get paid directly by the researcher — no platform holding your money.</li>
                <li>Build your profile once, apply in seconds from then on.</li>
              </ul>
              <Link
                href="/signup?role=participant"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[var(--ink)] px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Browse open studies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <h2 className="font-serif-display max-w-md text-3xl font-medium sm:text-4xl">
          One study, start to finish.
        </h2>
        <p className="mt-3 max-w-lg text-[var(--ink)]/70">
          The same session, timestamped like the recording it becomes.
        </p>

        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.time} className="border-l-2 border-[var(--mist)] pl-5">
              <span className="font-mono-utility text-xs text-[var(--coral)]">
                {step.time}
              </span>
              <h3 className="font-serif-display mt-2 text-lg font-medium">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Honest trust section */}
      <section className="border-t border-[var(--mist)]/70 bg-white/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <h2 className="font-serif-display max-w-lg text-3xl font-medium sm:text-4xl">
            No client logos. Just how it actually works.
          </h2>
          <p className="mt-3 max-w-lg text-[var(--ink)]/70">
            We&rsquo;re early, and we&rsquo;d rather earn your trust with the
            mechanics than borrow it with a logo wall.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div>
              <div className="h-9 w-9 rounded-full bg-[var(--coral)]" />
              <h3 className="mt-4 font-semibold">A screener that screens</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70">
                Every disqualifying answer is caught the moment someone
                applies — not three weeks later in a spreadsheet.
              </p>
            </div>
            <div>
              <div className="h-9 w-9 rounded-full bg-[var(--indigo)]" />
              <h3 className="mt-4 font-semibold">You control the calendar</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70">
                Post the times that work for you. Participants book directly
                — no back-and-forth to find a slot.
              </p>
            </div>
            <div>
              <div className="h-9 w-9 rounded-full bg-[var(--gold)]" />
              <h3 className="mt-4 font-semibold">A person checks every payment</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70">
                Incentives move directly between you and the participant. We
                verify each one by hand and you can always reach support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--mist)]/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)]/60">
            Built in Nepal. Made to travel.
          </p>
          <p className="text-sm text-[var(--ink)]/60">
            &copy; {new Date().getFullYear()} — Research Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
