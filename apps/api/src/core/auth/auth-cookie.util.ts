import type { DevLoginCookieInfo } from "@aucobot/shared";
import type { Response } from "express";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";
export const ACCESS_TOKEN_COOKIE_PATH = "/";
export const REFRESH_TOKEN_COOKIE_PATH = "/api/auth";

export interface AuthCookieMaxAge {
  accessMaxAgeMs: number;
  refreshMaxAgeMs: number;
}

/** Shared across www / app / api on production (e.g. `.aucobot.com`). Omit in dev. */
function authCookieDomain(): string | undefined {
  const domain = process.env.AUTH_COOKIE_DOMAIN?.trim();
  return domain || undefined;
}

function cookieBaseOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    ...(authCookieDomain() ? { domain: authCookieDomain() } : {}),
  };
}

export function setAccessCookie(res: Response, token: string, maxAgeMs: number): void {
  res.cookie(ACCESS_TOKEN_COOKIE, token, {
    ...cookieBaseOptions(),
    maxAge: maxAgeMs,
  });
}

export function setRefreshCookie(res: Response, token: string, maxAgeMs: number): void {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    ...cookieBaseOptions(),
    maxAge: maxAgeMs,
    path: REFRESH_TOKEN_COOKIE_PATH,
  });
}

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
  maxAge: AuthCookieMaxAge,
): void {
  setAccessCookie(res, tokens.accessToken, maxAge.accessMaxAgeMs);
  setRefreshCookie(res, tokens.refreshToken, maxAge.refreshMaxAgeMs);
}

export function clearAuthCookies(res: Response): void {
  const base = cookieBaseOptions();
  res.clearCookie(ACCESS_TOKEN_COOKIE, base);
  res.clearCookie(REFRESH_TOKEN_COOKIE, { ...base, path: REFRESH_TOKEN_COOKIE_PATH });
}

export function buildDevLoginCookieInfo(
  tokens: { accessToken: string; refreshToken: string },
  maxAge: AuthCookieMaxAge,
): {
  access_token: DevLoginCookieInfo;
  refresh_token: DevLoginCookieInfo;
} {
  const base = cookieBaseOptions();

  return {
    access_token: {
      name: ACCESS_TOKEN_COOKIE,
      value: tokens.accessToken,
      path: ACCESS_TOKEN_COOKIE_PATH,
      httpOnly: base.httpOnly,
      sameSite: base.sameSite,
      secure: base.secure,
      maxAgeMs: maxAge.accessMaxAgeMs,
    },
    refresh_token: {
      name: REFRESH_TOKEN_COOKIE,
      value: tokens.refreshToken,
      path: REFRESH_TOKEN_COOKIE_PATH,
      httpOnly: base.httpOnly,
      sameSite: base.sameSite,
      secure: base.secure,
      maxAgeMs: maxAge.refreshMaxAgeMs,
    },
  };
}

export function readCookieValue(cookies: unknown, name: string): string | undefined {
  if (!cookies || typeof cookies !== "object") {
    return undefined;
  }

  const raw = (cookies as Record<string, unknown>)[name];
  return typeof raw === "string" ? raw : undefined;
}
