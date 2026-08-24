"use server";

import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/friendlyError";
import { checkRateLimit } from "@/lib/rateLimit";
import { logEvent } from "@/lib/logEvent";

export type SignupFormState = { error: string | null; submitted: boolean };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function signUp(
  _prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const fullName = String(formData.get("fullName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "researcher") as
    | "researcher"
    | "participant";
  const referredBy = String(formData.get("referredBy") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", submitted: false };
  }

  const allowed = await checkRateLimit("signup", 5, 15);
  if (!allowed) {
    return {
      error: "Too many signup attempts — please wait a few minutes and try again.",
      submitted: false,
    };
  }

  const supabase = await createClient();
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, full_name: fullName, referred_by: referredBy },
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  });

  if (signUpError) {
    return { error: friendlyError(signUpError), submitted: false };
  }

  await logEvent(`signup_completed_${role}`);

  return { error: null, submitted: true };
}
