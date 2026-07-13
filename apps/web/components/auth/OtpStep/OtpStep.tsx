"use client";

import { useEffect, useRef, useState } from "react";

import {
  authAlertClassName,
  authGhostButtonClassName,
  authPrimaryButtonClassName,
} from "@/components/auth/auth-classes";
import { OtpInput } from "@/components/ui/OtpInput/OtpInput";

const OTP_LENGTH = 6;

interface OtpStepProps {
  maskedEmail: string;
  busy: boolean;
  error: string | null;
  resendEndsAt: number | null;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");

  if (!local || !domain) {
    return email;
  }

  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(local.length - 2, 1))}@${domain}`;
}

function getSecondsLeft(resendEndsAt: number | null, now: number): number {
  if (resendEndsAt === null) {
    return 0;
  }

  return Math.max(0, Math.ceil((resendEndsAt - now) / 1000));
}

export function OtpStep({
  maskedEmail,
  busy,
  error,
  resendEndsAt,
  onVerify,
  onResend,
  onBack,
}: OtpStepProps) {
  const [code, setCode] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const lastSubmittedCode = useRef<string | null>(null);

  useEffect(() => {
    if (resendEndsAt === null) {
      return undefined;
    }

    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [resendEndsAt]);

  const secondsLeft = getSecondsLeft(resendEndsAt, now);
  const canResend = secondsLeft === 0 && !busy;

  function handleComplete(nextCode: string) {
    if (busy || nextCode === lastSubmittedCode.current) {
      return;
    }

    lastSubmittedCode.current = nextCode;
    onVerify(nextCode);
  }

  function handleCodeChange(nextCode: string) {
    if (nextCode.length < OTP_LENGTH) {
      lastSubmittedCode.current = null;
    }

    setCode(nextCode);
  }

  return (
    <>
      <h1 className="mb-2 text-xl font-semibold text-text">Enter verification code</h1>
      <p className="mb-6 text-sm leading-normal text-description">
        We sent a code to{" "}
        <span className="font-semibold text-text">{maskEmail(maskedEmail)}</span>
      </p>

      {error && (
        <p className={authAlertClassName} role="alert">
          {error}
        </p>
      )}

      <OtpInput
        value={code}
        length={OTP_LENGTH}
        label="6-digit verification code"
        getDigitAriaLabel={(index, total) =>
          `Digit ${index + 1} of ${total}`
        }
        onChange={handleCodeChange}
        onComplete={handleComplete}
        disabled={busy}
      />

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          className={authPrimaryButtonClassName}
          disabled={busy || code.length !== OTP_LENGTH}
          onClick={() => handleComplete(code)}
        >
          {busy ? "Verifying…" : "Continue"}
        </button>

        <button
          type="button"
          className={authGhostButtonClassName}
          onClick={onBack}
          disabled={busy}
        >
          Use a different email
        </button>

        <p className="text-center text-sm text-description">
          {canResend ? (
            <button
              type="button"
              className={authGhostButtonClassName}
              onClick={onResend}
              disabled={busy}
            >
              Resend code
            </button>
          ) : (
            <>Resend available in {secondsLeft}s</>
          )}
        </p>
      </div>
    </>
  );
}
