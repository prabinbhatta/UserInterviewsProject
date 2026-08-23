import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";

export default async function ParticipantDashboard() {
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

  if (profile?.role !== "participant") {
    redirect("/researcher");
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Welcome, {profile?.full_name ?? user.email}
          </h1>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-zinc-500 underline"
            >
              Log out
            </button>
          </form>
        </div>
        <p className="mt-4 text-zinc-600">
          Find studies that fit and apply for the ones you want to join.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/participant/studies"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Browse studies
          </Link>
          <Link
            href="/participant/applications"
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Your applications
          </Link>
        </div>
      </div>
    </div>
  );
}
