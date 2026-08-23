"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/friendlyError";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);

    if (updateError) {
      setError(friendlyError(updateError));
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (done) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[var(--paper)] px-6 py-16">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-serif-display text-3xl font-medium text-[var(--ink)]">
            Password updated
          </h1>
          <p className="mt-3 text-[var(--ink)]/70">Taking you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--paper)] px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="font-serif-display text-3xl font-medium text-[var(--ink)]">
          Set a new password
        </h1>

        <label className={`mt-6 ${labelClasses}`}>
          New password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className={`mt-4 ${labelClasses}`}>
          Confirm new password
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={fieldClasses}
          />
        </label>

        {error && <p className="mt-3 text-sm text-[#a8371c]">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-6 w-full">
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  );
}
