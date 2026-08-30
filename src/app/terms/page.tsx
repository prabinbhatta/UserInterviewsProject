import Link from "next/link";
import { mutedLinkClasses } from "@/components/ui/link";

export const metadata = {
  title: "Terms of Service — PanelMeet",
};

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-2xl">
        <Link href="/" className={`text-sm ${mutedLinkClasses}`}>
          Back home
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium text-[var(--ink)]">
          Terms of Service
        </h1>
        <p className="mt-1 text-sm text-[var(--ink)]/70">Last updated 23 August 2026</p>

        <div className="mt-8 space-y-6 text-[var(--ink)]/80">
          <p>
            PanelMeet (&ldquo;the platform&rdquo;, &ldquo;we&rdquo;) connects
            companies running user research studies (&ldquo;researchers&rdquo;) with
            people willing to take part in them (&ldquo;participants&rdquo;). By
            creating an account, you agree to these terms.
          </p>

          <section>
            <h2 className="font-semibold text-[var(--ink)]">1. What the platform does</h2>
            <p className="mt-2">
              We provide the tools to post studies, screen and approve
              applicants, schedule sessions, and message between researcher and
              participant. We do not run the research sessions themselves, and
              we are not a party to any agreement between a researcher and a
              participant beyond facilitating that connection.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--ink)]">2. Incentive payments</h2>
            <p className="mt-2">
              Incentive payments for taking part in a study happen directly
              between the researcher and the participant, outside the
              platform. We do not hold, process, or guarantee any payment. A
              researcher marks an incentive as sent, and a participant
              confirms whether they received it; unresolved reports are
              reviewed by our team, but we cannot force a payment to be made.
              If you believe a payment dispute needs urgent attention, contact
              support at{" "}
              <span className="font-medium text-[var(--ink)]">+977-9715633635</span>.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--ink)]">3. Accounts and conduct</h2>
            <p className="mt-2">
              You&apos;re responsible for the accuracy of the information you
              provide and for keeping your account credentials secure. You
              agree not to post spam or fraudulent studies, harass other
              users, misrepresent who you are, or use the platform for
              anything unlawful. We may suspend or remove an account or study
              that violates this, including in response to a user report.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--ink)]">4. Screener answers and study data</h2>
            <p className="mt-2">
              Researchers see the screener answers and profile information a
              participant submits when applying to their study, and messages
              exchanged within that application. Researchers agree to use this
              information only to evaluate and run that study, not for
              unrelated purposes.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--ink)]">5. No guarantee of matches or outcomes</h2>
            <p className="mt-2">
              We don&apos;t guarantee a researcher will find qualified
              participants, or that a participant will be approved for or paid
              for any study they apply to. The platform is provided
              &ldquo;as is&rdquo; during this early phase, without warranties of any
              kind.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--ink)]">6. Changes</h2>
            <p className="mt-2">
              We&apos;re a young platform and these terms may change as the
              product evolves. We&apos;ll update the date at the top of this page
              when we do.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--ink)]">7. Contact</h2>
            <p className="mt-2">
              Questions about these terms can be sent to{" "}
              <span className="font-medium text-[var(--ink)]">
                +977-9715633635
              </span>
              .
            </p>
          </section>

          <p className="border-t border-[var(--line)] pt-6 text-sm text-[var(--ink)]/70">
            This is a plain-language policy for an early-stage platform, not a
            substitute for independent legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
