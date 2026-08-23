import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Nepal User Research",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-sm text-zinc-500 underline">
          Back home
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Privacy Policy
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Last updated 23 August 2026</p>

        <div className="mt-8 space-y-6 text-zinc-700">
          <p>
            This page explains what information Nepal User Research collects
            and how it&apos;s used. We collect only what&apos;s needed to run the
            platform and keep it trustworthy for both researchers and
            participants.
          </p>

          <section>
            <h2 className="font-semibold text-zinc-900">1. What we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Account info: name, email, and password (handled securely by our authentication provider — we never see or store your password in plain text).</li>
              <li>
                Participant profile details you choose to add: district, age,
                occupation, income band, languages, and devices — used to
                match you with relevant studies.
              </li>
              <li>
                Study and screener content researchers create, and the
                answers participants submit when applying.
              </li>
              <li>
                Messages sent between a researcher and participant within an
                application thread.
              </li>
              <li>
                Basic activity data (which studies you applied to, session
                scheduling, incentive status) needed to operate the platform.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-zinc-900">2. How we use it</h2>
            <p className="mt-2">
              We use your information to run the core features of the
              platform — matching participants to studies, letting
              researchers review applicants, scheduling sessions, sending
              email notifications about your applications, and tracking
              incentive status. We don&apos;t sell your data, and we don&apos;t use it
              for advertising.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-zinc-900">3. Who can see it</h2>
            <p className="mt-2">
              A researcher can see the profile and screener answers of
              participants who apply to their study, and messages within that
              application. A participant can see a study&apos;s public details
              and messages from the researcher they&apos;re talking to. Our team
              can access data to operate the platform, investigate reports, or
              resolve an incentive dispute — we don&apos;t share it with anyone
              outside the platform except where required by law.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-zinc-900">4. Payments</h2>
            <p className="mt-2">
              We don&apos;t collect or process payment details. Incentive
              payments happen directly between researcher and participant,
              outside the platform.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-zinc-900">5. Data retention</h2>
            <p className="mt-2">
              We keep your data for as long as your account is active. If you&apos;d
              like your account and associated data deleted, contact support
              and we&apos;ll process that request.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-zinc-900">6. Security</h2>
            <p className="mt-2">
              Access to your data is controlled at the database level so that,
              by default, only you — and whoever you&apos;re matched with through
              an application — can see information tied to that application.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-zinc-900">7. Contact</h2>
            <p className="mt-2">
              Questions about this policy, or requests about your data, can be
              sent to{" "}
              <span className="font-medium text-zinc-900">
                +977-9715633635
              </span>
              .
            </p>
          </section>

          <p className="border-t border-zinc-200 pt-6 text-sm text-zinc-500">
            This is a plain-language policy for an early-stage platform, not a
            substitute for independent legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
