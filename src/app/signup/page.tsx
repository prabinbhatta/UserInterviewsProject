"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Role = "researcher" | "participant";

function SignupForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role");
  const [role, setRole] = useState<Role>(
    initialRole === "participant" ? "participant" : "researcher",
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Check your email
        </h1>
        <p className="mt-3 text-zinc-600">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account, then come back and log in.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Create an account
      </h1>

      <div className="mt-6 flex rounded-lg border border-zinc-300 p-1">
        <button
          type="button"
          onClick={() => setRole("researcher")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            role === "researcher"
              ? "bg-zinc-900 text-white"
              : "text-zinc-600"
          }`}
        >
          I need research done
        </button>
        <button
          type="button"
          onClick={() => setRole("participant")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            role === "participant"
              ? "bg-zinc-900 text-white"
              : "text-zinc-600"
          }`}
        >
          I want to join studies
        </button>
      </div>

      <label className="mt-5 block text-sm font-medium text-zinc-700">
        Full name
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-zinc-700">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-zinc-700">
        Password
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>

      <p className="mt-4 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
      <Suspense>
        <SignupForm />
      </Suspense>
    </div>
  );
}
