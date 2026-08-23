import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";

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
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <h1 className="min-w-0 text-2xl font-semibold text-zinc-900">
            Welcome, {profile?.full_name ?? user.email}
          </h1>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/settings"
              className="whitespace-nowrap text-sm text-zinc-500 underline"
            >
              Settings
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="whitespace-nowrap text-sm text-zinc-500 underline"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
        <p className="mt-4 text-zinc-600">
          Manage the studies you&apos;re running and recruit participants.
        </p>
        <Link
          href="/researcher/studies"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          View your studies
        </Link>
      </div>
    </div>
  );
}
