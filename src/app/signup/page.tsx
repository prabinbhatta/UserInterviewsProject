"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/app/LanguageProvider";
import { friendlyError } from "@/lib/friendlyError";
import { logEvent } from "@/lib/logEvent";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

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
      setError(friendlyError(signUpError));
      return;
    }

    setSubmitted(true);
    logEvent(`signup_completed_${role}`);
  }

  if (submitted) {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif-display text-3xl font-medium text-[var(--ink)]">
          {t("checkEmailTitle")}
        </h1>
        <p className="mt-3 text-[var(--ink)]/70">
          {t("checkEmailBody")} <strong>{email}</strong>. {t("checkEmailBody2")}
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-[var(--ink)]/60 underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
        >
          {t("goToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <h1 className="font-serif-display text-3xl font-medium text-[var(--ink)]">
        {t("signupTitle")}
      </h1>

      <div className="mt-6 flex rounded-full border border-[var(--mist)] p-1">
        <button
          type="button"
          onClick={() => setRole("researcher")}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
            role === "researcher"
              ? "bg-[var(--ink)] text-white"
              : "text-[var(--ink)]/60"
          }`}
        >
          {t("tabResearcher")}
        </button>
        <button
          type="button"
          onClick={() => setRole("participant")}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
            role === "participant"
              ? "bg-[var(--ink)] text-white"
              : "text-[var(--ink)]/60"
          }`}
        >
          {t("tabParticipant")}
        </button>
      </div>

      <label className={`mt-5 ${labelClasses}`}>
        {t("fullName")}
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={fieldClasses}
        />
      </label>

      <label className={`mt-4 ${labelClasses}`}>
        {t("email")}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClasses}
        />
      </label>

      <label className={`mt-4 ${labelClasses}`}>
        {t("password")}
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldClasses}
        />
      </label>

      {error && <p className="mt-3 text-sm text-[#a8371c]">{error}</p>}

      <p className="mt-4 text-center text-xs text-[var(--ink)]/70">
        {t("agreeToTerms")}{" "}
        <Link href="/terms" className="underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)]">
          {t("termsLink")}
        </Link>{" "}
        {t("and")}{" "}
        <Link href="/privacy" className="underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)]">
          {t("privacyLink")}
        </Link>
        .
      </p>

      <Button type="submit" disabled={loading} className="mt-4 w-full">
        {loading ? t("creatingAccount") : t("signUp")}
      </Button>

      <p className="mt-4 text-center text-sm text-[var(--ink)]/60">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/login"
          className="underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
        >
          {t("logInLink")}
        </Link>
      </p>
    </form>
  );
}

function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="absolute top-6 right-6 flex items-center rounded-full border border-[var(--mist)] p-0.5 text-xs">
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "en" ? "bg-[var(--ink)] text-white" : "text-[var(--ink)]/70"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ne")}
        aria-pressed={lang === "ne"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "ne" ? "bg-[var(--ink)] text-white" : "text-[var(--ink)]/70"
        }`}
      >
        ने
      </button>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center bg-[var(--paper)] px-6 py-16">
      <LanguageToggle />
      <Suspense>
        <SignupForm />
      </Suspense>
    </div>
  );
}
