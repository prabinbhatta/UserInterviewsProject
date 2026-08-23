import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function ResearcherDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "researcher") {
    redirect("/participant");
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <h1 className="min-w-0 font-serif-display text-3xl font-medium text-[var(--ink)]">
            Welcome, {profile?.full_name ?? user.email}
          </h1>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/settings"
              className="whitespace-nowrap text-sm text-[var(--ink)]/70 underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
            >
              Settings
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="whitespace-nowrap text-sm text-[var(--ink)]/70 underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
        <p className="mt-4 text-[var(--ink)]/70">
          Manage the studies you&apos;re running and recruit participants.
        </p>
        <LinkButton href="/researcher/studies" variant="primary" className="mt-6">
          View your studies
        </LinkButton>
      </div>
    </div>
  );
}
