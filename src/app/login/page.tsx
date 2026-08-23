"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/friendlyError";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setLoading(false);
      setError(friendlyError(signInError, "Incorrect email or password."));
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);
    router.push(profile?.role === "participant" ? "/participant" : "/researcher");
    router.refresh();
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--paper)] px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="font-serif-display text-3xl font-medium text-[var(--ink)]">
          Log in
        </h1>

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

        <label className={`mt-4 ${labelClasses}`}>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClasses}
          />
        </label>

        <p className="mt-2 text-right text-sm">
          <Link
            href="/forgot-password"
            className="text-[var(--ink)]/50 underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
          >
            Forgot password?
          </Link>
        </p>

        {error && <p className="mt-3 text-sm text-[#a8371c]">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-6 w-full">
          {loading ? "Logging in..." : "Log in"}
        </Button>

        <p className="mt-4 text-center text-sm text-[var(--ink)]/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
