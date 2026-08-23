import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./SettingsForm";
import { mutedLinkClasses } from "@/components/ui/link";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, notify_approved, notify_scheduled, notify_messages, notify_incentives")
    .eq("id", user.id)
    .single();

  const backHref = profile?.role === "participant" ? "/participant" : "/researcher";

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href={backHref} className={`text-sm ${mutedLinkClasses}`}>
          Back to dashboard
        </Link>
        <h1 className="mt-2 font-serif-display text-3xl font-medium text-[var(--ink)]">
          Settings
        </h1>

        <SettingsForm
          defaultValues={{
            notify_approved: profile?.notify_approved ?? true,
            notify_scheduled: profile?.notify_scheduled ?? true,
            notify_messages: profile?.notify_messages ?? true,
            notify_incentives: profile?.notify_incentives ?? true,
          }}
        />
      </div>
    </div>
  );
}
