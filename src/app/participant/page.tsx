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
          Participant dashboard — browsing and applying to studies is
          coming in the next module.
        </p>
      </div>
    </div>
  );
}
