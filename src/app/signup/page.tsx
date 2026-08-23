"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/app/LanguageProvider";

type Role = "researcher" | "participant";

function SignupForm() {
  const { t } = useLanguage();
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
          {t("checkEmailTitle")}
        </h1>
        <p className="mt-3 text-zinc-600">
          {t("checkEmailBody")} <strong>{email}</strong>. {t("checkEmailBody2")}
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm underline">
          {t("goToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-zinc-900">
        {t("signupTitle")}
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
          {t("tabResearcher")}
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
          {t("tabParticipant")}
        </button>
      </div>

      <label className="mt-5 block text-sm font-medium text-zinc-700">
        {t("fullName")}
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-zinc-700">
        {t("email")}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-zinc-700">
        {t("password")}
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
        {loading ? t("creatingAccount") : t("signUp")}
      </button>

      <p className="mt-4 text-center text-sm text-zinc-500">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/login" className="underline">
          {t("logInLink")}
        </Link>
      </p>
    </form>
  );
}

function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="absolute top-6 right-6 flex items-center rounded-full border border-zinc-300 p-0.5 text-xs">
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "en" ? "bg-zinc-900 text-white" : "text-zinc-500"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ne")}
        aria-pressed={lang === "ne"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "ne" ? "bg-zinc-900 text-white" : "text-zinc-500"
        }`}
      >
        ने
      </button>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
      <LanguageToggle />
      <Suspense>
        <SignupForm />
      </Suspense>
    </div>
  );
}
