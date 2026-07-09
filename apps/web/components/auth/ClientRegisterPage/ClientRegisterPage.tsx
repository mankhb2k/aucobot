"use client";

import { useMemo } from "react";

import { AuthShell } from "@/components/auth/AuthShell/AuthShell";
import { EmailStep } from "@/components/auth/EmailStep/EmailStep";
import { OtpStep } from "@/components/auth/OtpStep/OtpStep";
import { useEmailOtpFlow } from "@/hooks/auth/use-email-otp-flow";
import { createAuthFlowStore } from "@/stores/auth-flow/auth-flow.store";

export function ClientRegisterPage() {
  const store = useMemo(() => createAuthFlowStore("register"), []);
  const flow = useEmailOtpFlow(store);

  return (
    <AuthShell>
      {flow.step === "email" ? (
        <EmailStep
          mode="register"
          busy={flow.busy}
          error={flow.error}
          onSubmit={(nextEmail) => void flow.submitEmail(nextEmail)}
        />
      ) : (
        <OtpStep
          maskedEmail={flow.email}
          busy={flow.busy}
          error={flow.error}
          resendEndsAt={flow.resendEndsAt}
          onVerify={(code) => void flow.verifyCode(code)}
          onResend={() => void flow.resendCode()}
          onBack={flow.goBackToEmail}
        />
      )}
    </AuthShell>
  );
}
