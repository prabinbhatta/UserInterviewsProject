"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function adminResolveIncentive(applicationId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("incentive_records")
    .update({ status: "received", responded_at: new Date().toISOString() })
    .eq("application_id", applicationId)
    .eq("status", "not_received");
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
