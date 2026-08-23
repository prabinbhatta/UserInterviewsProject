import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const supabase = await createClient();

  // token_hash verification doesn't need the browser that started signup —
  // unlike the PKCE `code` exchange below, it works even if the
  // confirmation link is opened on a different device or browser.
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(
        `${origin}${type === "recovery" ? "/reset-password" : "/login"}`,
      );
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Supabase's default (non-token_hash) email templates redirect here
      // with just ?code=..., dropping the original type — so we carry it
      // ourselves via the redirectTo URL passed when the flow started
      // (see resetPasswordForEmail's redirectTo) and read it back here.
      return NextResponse.redirect(
        `${origin}${type === "recovery" ? "/reset-password" : "/login"}`,
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
}
