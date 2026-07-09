"use client";

import { useState } from "react";

import { authApi, AuthApiError } from "@/lib/api/auth";
import { appUrl } from "@/lib/host/urls";

import styles from "./DevLoginButton.module.css";

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
    <div className={styles.wrap}>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className={styles.btn}
        onClick={() => void handleDevLogin()}
        disabled={busy}
      >
        {busy ? "Signing in…" : "Dev login (no OTP)"}
      </button>
      <p className={styles.hint}>Development only — uses DEV_AUTH_EMAIL on the API.</p>
    </div>
  );
}
