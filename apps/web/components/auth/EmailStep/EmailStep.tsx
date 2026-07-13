"use client";

import Link from "next/link";
import { useState } from "react";

import {
  authAlertClassName,
  authFieldClassName,
  authPrimaryButtonClassName,
  authSecondaryLinkClassName,
} from "@/components/auth/auth-classes";
import { authApi } from "@/lib/api/auth";

import type { AuthFlowMode } from "@/stores/auth-flow/auth-flow.store";

interface EmailStepProps {
  mode: AuthFlowMode;
  busy: boolean;
  error: string | null;
  onSubmit: (email: string) => void;
}

const COPY = {
  login: {
    title: "Sign in with email",
    cta: "Continue",
    crossText: "Don't have an account?",
    crossLabel: "Sign up",
    crossHref: "/register",
  },
  register: {
    title: "Enter your email",
    cta: "Sign up for free",
    crossText: "Already have an account?",
    crossLabel: "Sign in",
    crossHref: "/login",
  },
} as const;

export function EmailStep({ mode, busy, error, onSubmit }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const copy = COPY[mode];
  const apiUrl = authApi.getApiUrl();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(email);
  }

  return (
    <>
      <h1 className="mb-2 text-xl font-semibold text-text">{copy.title}</h1>
      <p className="mb-6 leading-normal text-description">
        We&apos;ll send a 6-digit code to your inbox.
      </p>

      {error && (
        <p className={authAlertClassName} role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label className="mb-4 flex flex-col gap-2">
          <span className="font-medium text-description">Email</span>
          <input
            type="email"
            className={authFieldClassName}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>

        <button
          type="submit"
          className={authPrimaryButtonClassName}
          disabled={busy}
        >
          {busy ? "Sending…" : copy.cta}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-description">
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        or
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>

      <a href={`${apiUrl}/api/auth/google`} className={authSecondaryLinkClassName}>
        Continue with Google
      </a>

      <p className="mt-6 text-center text-description">
        {copy.crossText}{" "}
        <Link href={copy.crossHref} className="font-semibold text-primary no-underline hover:text-primary-hover">
          {copy.crossLabel}
        </Link>
      </p>
    </>
  );
}
