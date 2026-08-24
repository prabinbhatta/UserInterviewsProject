"use server";

import { createClient } from "@/lib/supabase/server";

// Fire-and-forget: analytics must never break the flow it's attached to.
export async function logEvent(eventType: string, path?: string) {
  try {
    const supabase = await createClient();
    await supabase.from("analytics_events").insert({ event_type: eventType, path });
  } catch {
    // Swallow — losing an analytics event is fine, breaking signup isn't.
  }
}
