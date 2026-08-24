"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginFormState } from "./actions";
import { Button } from "@/components/ui/Button";
import { fieldClasses, labelClasses } from "@/components/ui/field";

const initialState: LoginFormState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--paper)] px-6 py-16">
      <form action={formAction} className="w-full max-w-sm">
        <h1 className="font-serif-display text-3xl font-medium text-[var(--ink)]">
          Log in
        </h1>

        <label className={`mt-6 ${labelClasses}`}>
          Email
          <input
            type="email"
            name="email"
            required
            className={fieldClasses}
          />
        </label>

        <label className={`mt-4 ${labelClasses}`}>
          Password
          <input
            type="password"
            name="password"
            required
            className={fieldClasses}
          />
        </label>

        <p className="mt-2 text-right text-sm">
          <Link
            href="/forgot-password"
            className="text-[var(--ink)]/70 underline decoration-[var(--mist)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
          >
            Forgot password?
          </Link>
        </p>

        {state.error && <p className="mt-3 text-sm text-[#a8371c]">{state.error}</p>}

        <Button type="submit" disabled={pending} className="mt-6 w-full">
          {pending ? "Logging in..." : "Log in"}
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
