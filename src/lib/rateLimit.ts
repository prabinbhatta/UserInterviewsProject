import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

// Fails open — a bug in our own rate-limit check should never lock real
// users out of signing up or logging in.
export async function checkRateLimit(
  action: "signup" | "login",
  maxAttempts: number,
  windowMinutes: number,
): Promise<boolean> {
  const identifier = await getClientIp();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_auth_rate_limit", {
    p_identifier: identifier,
    p_action: action,
    p_max_attempts: maxAttempts,
    p_window_minutes: windowMinutes,
  });
  if (error) return true;
  return data === true;
}
