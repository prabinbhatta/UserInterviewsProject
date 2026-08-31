"use client";

import { useState, useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/app/LanguageProvider";
import { signUp, type SignupFormState } from "./actions";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";
import { AppHeader } from "@/components/AppHeader";

type Role = "researcher" | "participant";

const initialState: SignupFormState = { error: null, submitted: false };

function SignupForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role");
  const referredBy = searchParams.get("ref") ?? "";
  const [role, setRole] = useState<Role>(
    initialRole === "participant" ? "participant" : "researcher",
  );
  const [email, setEmail] = useState("");
  const [state, formAction, pending] = useActionState(signUp, initialState);

  if (state.submitted) {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="font-display text-3xl font-medium text-[var(--ink)]">
          {t("checkEmailTitle")}
        </h1>
        <p className="mt-3 text-[var(--ink)]/70">
          {t("checkEmailBody")} <strong>{email}</strong>. {t("checkEmailBody2")}
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-[var(--ink)]/60 underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
        >
          {t("goToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-sm">
      <h1 className="font-display text-3xl font-medium text-[var(--ink)]">
        {t("signupTitle")}
      </h1>

      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="referredBy" value={referredBy} />

      <div className="mt-6 flex rounded-full border border-[var(--line)] p-1">
        <button
          type="button"
          onClick={() => setRole("researcher")}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors duration-150 ease-interact ${
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
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors duration-150 ease-interact ${
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
        <input type="text" name="fullName" required className={fieldClasses} />
      </label>

      <label className={`mt-4 ${labelClasses}`}>
        {t("email")}
        <input
          type="email"
          name="email"
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
          name="password"
          required
          minLength={8}
          className={fieldClasses}
        />
      </label>

      {state.error && <p className="mt-3 text-sm text-[#a8371c]">{state.error}</p>}

      <p className="mt-4 text-center text-xs text-[var(--ink)]/70">
        {t("agreeToTerms")}{" "}
        <Link href="/terms" className="underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)]">
          {t("termsLink")}
        </Link>{" "}
        {t("and")}{" "}
        <Link href="/privacy" className="underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)]">
          {t("privacyLink")}
        </Link>
        .
      </p>

      <Button type="submit" disabled={pending} className="mt-4 w-full">
        {pending ? t("creatingAccount") : t("signUp")}
      </Button>

      <p className="mt-4 text-center text-sm text-[var(--ink)]/60">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/login"
          className="underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
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
    <div className="absolute top-6 right-6 flex items-center rounded-full border border-[var(--line)] p-0.5 text-xs">
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-2.5 py-1 transition-colors duration-150 ease-interact ${
          lang === "en" ? "bg-[var(--ink)] text-white" : "text-[var(--ink)]/70"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ne")}
        aria-pressed={lang === "ne"}
        className={`rounded-full px-2.5 py-1 transition-colors duration-150 ease-interact ${
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
    <>
      <AppHeader />
      <div className="relative flex flex-1 items-center justify-center bg-[var(--paper)] px-6 py-16">
        <LanguageToggle />
        <Suspense>
          <SignupForm />
        </Suspense>
      </div>
    </>
  );
}
