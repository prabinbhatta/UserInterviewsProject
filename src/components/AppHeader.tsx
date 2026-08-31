import Link from "next/link";
import { Logo } from "./Logo";

// Slim brand header for every non-landing page — internal dashboards,
// auth pages, settings, public browse/invite pages. The landing page
// keeps its own richer SiteHeader (language toggle, scroll behavior);
// this is just enough presence that the app doesn't go logo-less the
// moment someone leaves the home page.
export function AppHeader({ href = "/" }: { href?: string }) {
  return (
    <header className="border-b border-[var(--line)]/70">
      <div className="mx-auto flex w-full max-w-6xl items-center px-6 py-5 sm:px-10">
        <Link href={href} className="transition-opacity duration-150 ease-interact hover:opacity-70">
          <Logo wordmark="PanelMeet" size={18} />
        </Link>
      </div>
    </header>
  );
}
