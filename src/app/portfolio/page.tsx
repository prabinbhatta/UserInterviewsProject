import type { Metadata } from "next";

const TITLE = "Prabin Bhatta — Senior Business Analyst";
const DESCRIPTION =
  "Senior Business Analyst turning ambiguous requirements into shipped software — across fintech, e-commerce, and UK enterprise projects. Also builds and ships his own products.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const EXPERIENCE = [
  {
    company: "EB Pearls",
    location: "Kupondole, Lalitpur, Nepal",
    roles: [
      { title: "Senior Business Analyst", period: "Nov 2025 — Present" },
      { title: "Business Analyst", period: "Sep 2023 — Nov 2025" },
    ],
    bullets: [
      "Gather and document requirements directly from clients, producing SRS documents and wireframes that drive design and development.",
      "Translate stakeholder needs into user stories and backlog items in JIRA, running Grooming, Sprint Planning, Daily Standup, Sprint Health, and Retrospective ceremonies.",
      "Own requirement sign-off across SRS and wireframe/design before handoff to the development team.",
      "Run business requirement testing in UAT and track deliverables through to on-time completion.",
    ],
  },
  {
    company: "LogicaBeans Pvt. Ltd.",
    subtitle: "F1 Soft Group",
    location: "Durbarmarg, Kathmandu, Nepal",
    roles: [
      { title: "Product Owner", period: "Nov 2022 — Aug 2023" },
      { title: "Business Analyst", period: "May 2022 — Nov 2022" },
    ],
    bullets: [
      "Evaluated business processes end-to-end, surfacing requirements and improvement areas the client hadn't yet articulated.",
      "Turned Figma prototypes into client-approved designs, then broke them into prioritized backlog items in JIRA.",
      "Tracked releases across Dev, QA, UAT, and Production, writing release notes and demoing shipped work to clients every sprint.",
    ],
  },
  {
    company: "SeeLogic International Pvt. Ltd.",
    subtitle: "Dogma Group",
    location: "Bafal, Kathmandu, Nepal",
    roles: [{ title: "Junior Business Analyst", period: "Apr 2021 — Mar 2022" }],
    bullets: [
      "Gathered and cross-validated requirements from stakeholders across multiple UK-based projects.",
      "Produced Fit-Gap and Blueprint documents, process models, UML diagrams, and entity/field documentation for handoff to functional consultants and developers.",
      "Wrote scripts for a Learning Management Portal (LMS) serving multiple UK client projects.",
    ],
  },
];

const EARLIER_ROLES = [
  {
    title: "Business Analyst Intern",
    company: "Online Basket Pvt. Ltd.",
    location: "Baneshwor, Kathmandu",
    period: "Sep 2020 — Mar 2021",
  },
  {
    title: "Mobile App Development Intern",
    company: "DV Excellus Pvt. Ltd.",
    location: "Kupondole, Kathmandu",
    period: "Aug 2019 — Nov 2019",
  },
];

const SKILL_GROUPS = [
  {
    label: "Business analysis & delivery",
    skills: [
      "Requirements gathering",
      "SRS / BRD documentation",
      "Wireframing",
      "UML & process modeling",
      "Fit-Gap analysis",
      "Agile / Scrum ceremonies",
      "JIRA",
      "UAT testing",
    ],
  },
  {
    label: "Data & analytics",
    skills: ["Power BI", "Tableau", "Oracle SQL", "Advanced SQL", "Google Analytics"],
  },
  {
    label: "CRM / ERP platforms",
    skills: [
      "Dynamics 365 Sales",
      "Dynamics 365 Marketing",
      "Dynamics 365 Customer Service",
      "Dynamics 365 Business Central",
    ],
  },
  {
    label: "Technical",
    skills: ["REST APIs", "Flutter", "Python", "PHP & Laravel"],
  },
];

const EDUCATION = [
  {
    degree: "MBA, Entrepreneurship",
    school: "Kings College, affiliated to Westcliff University",
    period: "2022 — 2024",
  },
  {
    degree: "BSc (Hons), Computing",
    school: "Islington College, affiliated to London Metropolitan University",
    period: "2017 — 2020",
  },
];

const CERTIFICATIONS = [
  { name: "Business Analysis Foundations", issuer: "LinkedIn" },
  { name: "Agile Foundations", issuer: "LinkedIn" },
  { name: "The Business Intelligence Analyst Course 2021", issuer: "Udemy" },
  { name: "The Project Management Course: Beginner to PM", issuer: "Udemy" },
  { name: "Advanced SQL for Query Tuning and Performance Optimization", issuer: "LinkedIn" },
  { name: "Advanced SQL for Data Scientists", issuer: "LinkedIn" },
  { name: "Oracle Database 12c: Advanced SQL", issuer: "Udemy" },
  { name: "Google Analytics for Beginners", issuer: "Google Analytics Academy" },
  { name: "Artificial Intelligence Analyst — Explorer & Mastery Awards (2019)", issuer: "IBM" },
  { name: "Learn to Code in Python 3", issuer: "Udemy" },
  { name: "Building RESTful APIs in Laravel", issuer: "LinkedIn" },
  { name: "PHP for Beginners: CMS Project", issuer: "Udemy" },
  { name: "Learning Google Firebase for Flutter", issuer: "LinkedIn" },
];

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function PortfolioPage() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--paper)] text-[var(--ink)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-transparent bg-[var(--paper)]/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-6 sm:px-10">
          <a href="#top" className="font-serif-display text-lg font-medium text-[var(--ink)]">
            Prabin Bhatta
          </a>
          <nav className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono-utility text-xs uppercase tracking-widest text-[var(--ink)]/60 transition-colors hover:text-[var(--coral)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[var(--indigo)] hover:-translate-y-0.5"
          >
            Get in touch
          </a>
        </div>
      </header>

      <main id="top" className="mx-auto w-full max-w-4xl flex-1 px-6 sm:px-10">
        {/* Hero */}
        <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
          <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--coral)]">
            Business Analyst · Kathmandu, Nepal
          </p>
          <h1 className="mt-4 font-serif-display text-4xl font-medium leading-tight text-[var(--ink)] sm:text-6xl">
            I turn ambiguous requirements into software people actually ship.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ink)]/70">
            Senior Business Analyst with 5+ years across fintech, e-commerce, and UK
            enterprise projects — gathering requirements, writing the SRS, and running
            the agile ceremonies that keep delivery honest. I also build and ship my
            own products on the side.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--indigo)] hover:-translate-y-0.5"
            >
              See what I&apos;ve built
            </a>
            <a
              href="https://linkedin.com/in/bhattaprabin/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[var(--ink)]/15 bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] transition-all hover:border-[var(--coral)] hover:-translate-y-0.5"
            >
              Connect on LinkedIn
            </a>
          </div>
        </section>

        {/* About */}
        <section id="about" className="border-t border-[var(--mist)]/70 py-16">
          <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--indigo)]">
            About
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--ink)]/80">
            I work at the point where a client&apos;s problem becomes a development
            team&apos;s backlog — gathering requirements, writing SRS and BRD documents,
            building wireframes, and running the sprint ceremonies that turn all of
            it into something shipped. Along the way I picked up an MBA in
            Entrepreneurship, which is also why I don&apos;t just analyze products — I
            build them. The{" "}
            <a
              href="https://panelmeet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink)] underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
            >
              project below
            </a>{" "}
            is one I designed, built, and shipped end to end.
          </p>
        </section>

        {/* Experience */}
        <section id="experience" className="border-t border-[var(--mist)]/70 py-16">
          <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--indigo)]">
            Experience
          </p>
          <ul className="mt-8 space-y-10">
            {EXPERIENCE.map((job) => (
              <li
                key={job.company}
                className="rounded-2xl border border-[var(--mist)] bg-white p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-serif-display text-xl font-medium text-[var(--ink)]">
                    {job.company}
                    {job.subtitle && (
                      <span className="ml-2 text-sm font-normal text-[var(--ink)]/50">
                        {job.subtitle}
                      </span>
                    )}
                  </h3>
                  <span className="text-sm text-[var(--ink)]/60">{job.location}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                  {job.roles.map((role) => (
                    <p key={role.title} className="text-sm font-medium text-[var(--indigo)]">
                      {role.title}{" "}
                      <span className="font-normal text-[var(--ink)]/60">
                        · {role.period}
                      </span>
                    </p>
                  ))}
                </div>
                <ul className="mt-4 space-y-2">
                  {job.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-sm leading-relaxed text-[var(--ink)]/70"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--coral)]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-dashed border-[var(--mist)] p-6">
            <p className="text-sm font-medium text-[var(--ink)]/80">Earlier</p>
            <ul className="mt-3 space-y-2">
              {EARLIER_ROLES.map((role) => (
                <li key={role.title} className="text-sm text-[var(--ink)]/60">
                  <span className="text-[var(--ink)]/80">{role.title}</span> —{" "}
                  {role.company}, {role.location} · {role.period}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="border-t border-[var(--mist)]/70 py-16">
          <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--indigo)]">
            Skills
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label} className="rounded-2xl border border-[var(--mist)] bg-white p-5">
                <h3 className="text-sm font-semibold text-[var(--ink)]">{group.label}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[var(--mist)] px-3 py-1 text-xs text-[var(--ink)]/70"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="border-t border-[var(--mist)]/70 py-16">
          <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--indigo)]">
            Projects
          </p>
          <a
            href="https://research.prabinbhatta.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block rounded-2xl border border-[var(--mist)] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--coral)] sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-serif-display text-2xl font-medium text-[var(--ink)]">
                  PanelMeet
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--ink)]/70">
                  A two-sided marketplace connecting Nepali companies with research
                  participants, modeled functionally on UserInterviews.com. Designed
                  and built solo — schema and access-control design, a screener
                  engine that auto-qualifies applicants, scheduling, incentive
                  tracking, and a fully bilingual (English/Nepali) interface.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-white">
                Visit site →
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Next.js", "Supabase", "TypeScript", "Tailwind CSS", "PostgreSQL"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--mist)] px-3 py-1 font-mono-utility text-[11px] uppercase tracking-wider text-[var(--indigo)]"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </a>
        </section>

        {/* Education & Certifications */}
        <section className="border-t border-[var(--mist)]/70 py-16">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--indigo)]">
                Education
              </p>
              <ul className="mt-6 space-y-5">
                {EDUCATION.map((ed) => (
                  <li key={ed.degree}>
                    <p className="font-medium text-[var(--ink)]">{ed.degree}</p>
                    <p className="mt-0.5 text-sm text-[var(--ink)]/60">{ed.school}</p>
                    <p className="text-sm text-[var(--ink)]/60">{ed.period}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--indigo)]">
                Certifications
              </p>
              <ul className="mt-6 space-y-2">
                {CERTIFICATIONS.map((cert) => (
                  <li key={cert.name} className="text-sm text-[var(--ink)]/70">
                    {cert.name}{" "}
                    <span className="text-[var(--ink)]/50">— {cert.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-[var(--mist)]/70 py-16">
          <p className="font-mono-utility text-xs uppercase tracking-widest text-[var(--indigo)]">
            Contact
          </p>
          <h2 className="mt-4 font-serif-display text-3xl font-medium text-[var(--ink)] sm:text-4xl">
            Let&apos;s talk about what you&apos;re building.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:prabinbhatta07@gmail.com"
              className="inline-flex items-center justify-center rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--indigo)] hover:-translate-y-0.5"
            >
              prabinbhatta07@gmail.com
            </a>
            <a
              href="tel:+9779848633635"
              className="inline-flex items-center justify-center rounded-full border border-[var(--ink)]/15 bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] transition-all hover:border-[var(--coral)] hover:-translate-y-0.5"
            >
              +977 984 863 3635
            </a>
            <a
              href="https://linkedin.com/in/bhattaprabin/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[var(--ink)]/15 bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] transition-all hover:border-[var(--coral)] hover:-translate-y-0.5"
            >
              LinkedIn
            </a>
          </div>
          <p className="mt-4 text-sm text-[var(--ink)]/50">Mid-Baneshwor, Kathmandu, Nepal</p>
        </section>
      </main>

      <footer className="border-t border-[var(--mist)]/70 py-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-1 px-6 text-center text-xs text-[var(--ink)]/50 sm:px-10">
          <p>© {new Date().getFullYear()} Prabin Bhatta</p>
        </div>
      </footer>
    </div>
  );
}
