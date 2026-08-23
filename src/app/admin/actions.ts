"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/friendlyError";

export async function adminResolveIncentive(applicationId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("incentive_records")
    .update({ status: "received", responded_at: new Date().toISOString() })
    .eq("application_id", applicationId)
    .eq("status", "not_received");
  if (error) throw new Error(friendlyError(error));
  revalidatePath("/admin");
}

export async function adminResolveReport(reportId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .update({ status: "resolved", resolved_at: new Date().toISOString() })
    .eq("id", reportId)
    .eq("status", "open");
  if (error) throw new Error(friendlyError(error));
  revalidatePath("/admin");
}
