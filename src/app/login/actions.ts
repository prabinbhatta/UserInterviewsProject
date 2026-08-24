"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/friendlyError";
import { checkRateLimit } from "@/lib/rateLimit";

export type LoginFormState = { error: string | null };

export async function login(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const allowed = await checkRateLimit("login", 10, 15);
  if (!allowed) {
    return {
      error: "Too many login attempts — please wait a few minutes and try again.",
    };
  }

  const supabase = await createClient();
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { error: friendlyError(signInError, "Incorrect email or password.") };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  redirect(profile?.role === "participant" ? "/participant" : "/researcher");
}
