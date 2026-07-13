"use client";

import { useState } from "react";

import { authAlertClassName } from "@/components/auth/auth-classes";
import { authApi, AuthApiError } from "@/lib/api/auth";
import { appUrl } from "@/lib/host/urls";

export function DevLoginButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDevLogin() {
    setBusy(true);
    setError(null);

    try {
      await authApi.devLogin();
      window.location.assign(appUrl("/"));
    } catch (err) {
      const message =
        err instanceof AuthApiError ? err.message : "Dev login failed.";
      setError(message);
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 border-t border-dashed border-border pt-6">
      {error ? (
        <p className={`${authAlertClassName} mb-3`} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className="w-full cursor-pointer rounded-md border border-dashed border-border bg-transparent px-4 py-2.5 font-mono text-description transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => void handleDevLogin()}
        disabled={busy}
      >
        {busy ? "Signing in…" : "Dev login (no OTP)"}
      </button>
      <p className="mt-2 text-center text-xs text-description">
        Development only — uses DEV_AUTH_EMAIL on the API.
      </p>
    </div>
  );
}
