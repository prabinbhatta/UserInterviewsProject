"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/friendlyError";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/auth/callback?type=recovery` },
    );

    setLoading(false);

    if (resetError) {
      setError(friendlyError(resetError));
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[var(--paper)] px-6 py-16">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-serif-display text-3xl font-medium text-[var(--ink)]">
            Check your email
          </h1>
          <p className="mt-3 text-[var(--ink)]/70">
            If an account exists for <strong>{email}</strong>, we sent a link
            to reset your password.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm text-[var(--ink)]/60 underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--paper)] px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="font-serif-display text-3xl font-medium text-[var(--ink)]">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-[var(--ink)]/70">
          Enter the email on your account and we&apos;ll send you a link to
          set a new password.
        </p>

        <label className={`mt-6 ${labelClasses}`}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClasses}
          />
        </label>

        {error && <p className="mt-3 text-sm text-[#a8371c]">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-6 w-full">
          {loading ? "Sending..." : "Send reset link"}
        </Button>

        <p className="mt-4 text-center text-sm text-[var(--ink)]/60">
          <Link
            href="/login"
            className="underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
          >
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}
