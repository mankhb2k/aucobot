"use client";

import { useEffect, useState } from "react";

import { authApi } from "@/lib/api/auth";
import { marketingUrl } from "@/lib/host/urls";

import type { UserResponse } from "@aucobot/shared";

export type AuthGuardStatus = "checking" | "authenticated" | "unauthenticated";

interface UseAuthGuardResult {
  status: AuthGuardStatus;
  user: UserResponse | null;
}

/**
 * Client-side auth verification cho `app/app` (SPA — không SSR).
 * Edge (`proxy.ts`) đã chặn khi thiếu cookie; hook này xác thực token còn
 * hợp lệ qua API — hết hạn/không hợp lệ thì redirect sang trang login (domain marketing).
 */
export function useAuthGuard(): UseAuthGuardResult {
  const [status, setStatus] = useState<AuthGuardStatus>("checking");
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      const me = await authApi.getMe();

      if (cancelled) {
        return;
      }

      if (!me) {
        setStatus("unauthenticated");
        window.location.assign(marketingUrl("/login"));
        return;
      }

      setUser(me);
      setStatus("authenticated");
    }

    void checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  return { status, user };
}
