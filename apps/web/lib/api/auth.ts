
import { getApiBaseUrl } from "@/lib/http/api-base-url";
import {
  clearAuthSession,
  fetchWithAuth,
  setAuthSession,
} from "@/lib/http/fetch-with-auth";
import {
  apiErrorMessageSchema,
  authSuccessResponseSchema,
  sendEmailCodeResponseSchema,
  userResponseSchema,
} from "@/schemas/auth.schema";
import type {
  AuthSuccessResponse,
  EmailOtpPurpose,
  SendEmailCodeResponse,
  UserResponse,
} from "@aucobot/shared";

export class AuthApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

function formatApiError(data: unknown, fallback: string): string {
  const parsed = apiErrorMessageSchema.safeParse(data);

  if (!parsed.success || parsed.data.message === undefined) {
    return fallback;
  }

  return Array.isArray(parsed.data.message)
    ? parsed.data.message.join(", ")
    : parsed.data.message;
}

function throwApiError(data: unknown, fallback: string, status: number): never {
  throw new AuthApiError(formatApiError(data, fallback), status);
}

export const authApi = {
  getApiUrl(): string {
    return getApiBaseUrl();
  },

  async getMe(): Promise<UserResponse | null> {
    const res = await fetchWithAuth(`${getApiBaseUrl()}/api/auth/me`);

    if (res.status === 401 || !res.ok) {
      return null;
    }

    return userResponseSchema.parse(await res.json());
  },

  async sendEmailCode(
    email: string,
    purpose: EmailOtpPurpose,
  ): Promise<SendEmailCodeResponse> {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/email/send-code`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose }),
    });

    const data: unknown = await res.json();

    if (!res.ok) {
      throwApiError(data, "Could not send verification code.", res.status);
    }

    return sendEmailCodeResponseSchema.parse(data);
  },

  async verifyEmailCode(
    email: string,
    code: string,
    purpose: EmailOtpPurpose,
  ): Promise<AuthSuccessResponse> {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/email/verify-code`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, purpose }),
    });

    const data: unknown = await res.json();

    if (!res.ok) {
      throwApiError(data, "Verification failed.", res.status);
    }

    const parsed = authSuccessResponseSchema.parse(data);

    if (parsed.accessExpiresAt) {
      setAuthSession(parsed.accessExpiresAt);
    }

    return parsed;
  },

  async resendEmailCode(
    email: string,
    purpose: EmailOtpPurpose,
  ): Promise<SendEmailCodeResponse> {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/email/resend-code`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose }),
    });

    const data: unknown = await res.json();

    if (!res.ok) {
      throwApiError(data, "Could not resend verification code.", res.status);
    }

    return sendEmailCodeResponseSchema.parse(data);
  },

  async logout(): Promise<void> {
    await fetch(`${getApiBaseUrl()}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    clearAuthSession();
  },

  /** Development only — API returns 404 when NODE_ENV !== development. */
  async devLogin(): Promise<AuthSuccessResponse> {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/dev-login`, {
      method: "POST",
      credentials: "include",
    });

    const data: unknown = await res.json();

    if (!res.ok) {
      throwApiError(data, "Dev login is unavailable.", res.status);
    }

    const parsed = authSuccessResponseSchema.parse(data);

    if (parsed.accessExpiresAt) {
      setAuthSession(parsed.accessExpiresAt);
    }

    return parsed;
  },
};
