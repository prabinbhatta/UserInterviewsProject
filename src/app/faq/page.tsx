import Link from "next/link";
import { mutedLinkClasses } from "@/components/ui/link";
import { AppHeader } from "@/components/AppHeader";

export const metadata = {
  title: "FAQ — PanelMeet",
};

type Question = { q: string; a: React.ReactNode };
type Group = { title: string; items: Question[] };

const GROUPS: Group[] = [
  {
    title: "General",
    items: [
      {
        q: "What is PanelMeet?",
        a: "PanelMeet connects Nepali companies running user research with real, screened participants. A researcher posts a study with a screener, matching applicants are reviewed and approved, sessions get scheduled, and the incentive is paid by the researcher directly to the participant.",
      },
      {
        q: "Is it free to use?",
        a: "Yes, for now. PanelMeet is early-stage and doesn't charge either side yet. If that changes, we'll announce it clearly before anyone is billed.",
      },
      {
        q: "Where does PanelMeet operate?",
        a: "Nepal. Studies, participants, and incentive amounts (NPR) are all built around the local market, and the whole platform works in English or नेपाली — switch anytime with the toggle in the header.",
      },
    ],
  },
  {
    title: "For participants",
    items: [
      {
        q: "How do I find studies to join?",
        a: (
          <>
            Browse open studies at{" "}
            <Link href="/browse" className={mutedLinkClasses}>
              /browse
            </Link>{" "}
            without an account, or sign up to apply. Each study has a short
            screener — if your answers match what the researcher needs,
            you&apos;re automatically added to their review queue.
          </>
        ),
      },
      {
        q: "How do I get paid?",
        a: "Directly by the researcher, once your session is marked complete — cash, bank transfer, or eSewa/Khalti, however you two arrange it. PanelMeet doesn&apos;t hold or move money; we only track whether an incentive has been sent and confirm you received it.",
      },
      {
        q: "What if I don't receive my incentive?",
        a: "Mark it as \"not received\" on your application, or use the Report link on the study or the message thread. That opens a case our team reviews directly — we can't force a payment, but unresolved reports get followed up on.",
      },
      {
        q: "Can I change my mind after applying or being approved?",
        a: "Yes — you can withdraw an application at any point before the session happens. If you're approved and withdraw, your spot reopens for someone else.",
      },
      {
        q: "A study I want is full — can I still get in?",
        a: "Join its waitlist. If a spot opens up (someone withdraws, cancels, or doesn't show), you'll get an email and the study reopens automatically.",
      },
    ],
  },
  {
    title: "For researchers",
    items: [
      {
        q: "How do I post a study?",
        a: "From your dashboard, create a study, add a format, incentive, and a screener — questions with answers marked as qualifying or disqualifying. Anyone who applies is screened against that automatically, before you ever see them.",
      },
      {
        q: "How does scheduling work?",
        a: "Add open time slots to an approved application; the participant books one. For online studies, you can auto-generate a Google Meet link per slot, and both sides get a calendar (.ics) file and an email reminder before the session.",
      },
      {
        q: "Can I invite specific people instead of waiting for applicants?",
        a: "Yes — invite by email one at a time, bulk-import a list via CSV, or search the participant pool by district, age, device, and language and invite matches directly.",
      },
      {
        q: "What happens if a participant doesn't show up?",
        a: "Mark the session \"Didn't show up\" from the applicant's page. That frees the slot for someone else and creates no incentive record for that session.",
      },
      {
        q: "Is there a cost to post a study?",
        a: "Not right now — see \"Is it free to use?\" above.",
      },
    ],
  },
  {
    title: "Trust, safety & your data",
    items: [
      {
        q: "How are incentive payments tracked if PanelMeet doesn't process them?",
        a: "Every session carries an incentive status — pending, sent, confirmed received, or disputed — visible to both sides. It's a paper trail, not a payment guarantee, which is also why disputes go to a human, not an algorithm.",
      },
      {
        q: "What if I run into abuse, spam, or a bad actor?",
        a: "Use the Report link on a study or a message thread. It goes straight to our admin review queue, not just the other user.",
      },
      {
        q: "What does PanelMeet do with my data?",
        a: (
          <>
            Only what&apos;s needed to run the platform — see the full{" "}
            <Link href="/privacy" className={mutedLinkClasses}>
              Privacy Policy
            </Link>{" "}
            for exactly what&apos;s collected and who can see it.
          </>
        ),
      },
    ],
  },
  {
    title: "Account & technical",
    items: [
      {
        q: "I forgot my password",
        a: (
          <>
            Use{" "}
            <Link href="/forgot-password" className={mutedLinkClasses}>
              Forgot password
            </Link>{" "}
            on the login page — a reset link is emailed to you.
          </>
        ),
      },
      {
        q: "Can I use PanelMeet in Nepali?",
        a: "Yes — tap EN / ने in the header on any page to switch. The choice is remembered for future visits.",
      },
      {
        q: "Something's broken, or I have a question this page didn't answer.",
        a: "Message support at +977-9715633635. It's a small team, so replies land within a business day rather than instantly — but every message gets read.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <AppHeader />
      <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
        <div className="w-full max-w-2xl">
          <Link href="/" className={`text-sm ${mutedLinkClasses}`}>
            Back home
          </Link>
          <h1 className="mt-2 font-display text-3xl font-medium text-[var(--ink)]">
            Frequently asked questions
          </h1>
          <p className="mt-1 text-sm text-[var(--ink)]/70">
            Can&apos;t find what you need? Contact support at the bottom of this
            page.
          </p>

          <div className="mt-8 space-y-8">
            {GROUPS.map((group) => (
              <section key={group.title}>
                <h2 className="font-semibold text-[var(--ink)]">{group.title}</h2>
                <div className="mt-3 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                  {group.items.map((item) => (
                    <details key={item.q} className="group py-3">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-medium text-[var(--ink)] marker:content-none">
                        {item.q}
                        <span
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-[var(--ink)]/40 transition-transform duration-150 ease-interact group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <div className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--ink)]/70">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-10 border-t border-[var(--line)] pt-6 text-sm text-[var(--ink)]/70">
            Questions about a specific policy — payments, data, or your
            rights as a user — are covered in the{" "}
            <Link href="/terms" className={mutedLinkClasses}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className={mutedLinkClasses}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
