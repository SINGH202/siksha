"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/client";
import * as authApi from "@/lib/api/auth";
import type { PublicUser, UserRole } from "@/lib/api/types";
import { toE164Phone } from "@/lib/auth/phone";
import {
  clearSession,
  EMPTY_SESSION,
  getSession,
  homePathForRole,
  setAccessToken,
  setSession,
} from "@/lib/auth/session";

export { homePathForRole } from "@/lib/auth/session";
export type { PublicUser, UserRole };

function subscribe(onStoreChange: () => void) {
  window.addEventListener("siksha:auth", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("siksha:auth", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  return getSession();
}

function getServerSnapshot() {
  return EMPTY_SESSION;
}

export function useAuth() {
  const session = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const requestOtp = useCallback(async (rawPhone: string) => {
    const phone = toE164Phone(rawPhone);
    if (!phone) {
      throw new ApiError({
        statusCode: 400,
        code: "Bad Request",
        message: "Enter a valid 10-digit Indian mobile number",
      });
    }
    setPending(true);
    try {
      return await authApi.requestOtp(phone);
    } finally {
      setPending(false);
    }
  }, []);

  const verifyOtp = useCallback(async (rawPhone: string, code: string) => {
    const phone = toE164Phone(rawPhone);
    if (!phone) {
      throw new ApiError({
        statusCode: 400,
        code: "Bad Request",
        message: "Enter a valid mobile number",
      });
    }
    setPending(true);
    try {
      const result = await authApi.verifyOtp(phone, code);
      setSession({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
      return result;
    } finally {
      setPending(false);
    }
  }, []);

  const chooseRole = useCallback(async (role: UserRole) => {
    setPending(true);
    try {
      const result = await authApi.setRole(role);
      setAccessToken(result.accessToken, result.user);
      return result;
    } finally {
      setPending(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    router.replace("/login");
  }, [router]);

  return {
    ...session,
    isAuthenticated: Boolean(session.accessToken),
    pending,
    requestOtp,
    verifyOtp,
    chooseRole,
    logout,
    homePathForRole,
  };
}

export function useRequireAuth(options?: {
  role?: UserRole;
  allowNullRole?: boolean;
}) {
  const auth = useAuth();
  const router = useRouter();

  const role = auth.user?.role ?? null;
  const needsLogin = !auth.accessToken;
  const needsRole = Boolean(auth.accessToken) && !role && !options?.allowNullRole;
  const wrongRole = Boolean(options?.role && role && role !== options.role);
  const ready = Boolean(auth.accessToken) && !needsRole && !wrongRole;

  useEffect(() => {
    if (needsLogin) {
      router.replace("/login");
      return;
    }
    if (needsRole) {
      router.replace("/role");
      return;
    }
    if (wrongRole && role) {
      router.replace(homePathForRole(role));
    }
  }, [needsLogin, needsRole, wrongRole, role, router]);

  return { ...auth, ready };
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export function toastApiError(error: unknown, fallback?: string) {
  toast.error(getErrorMessage(error, fallback));
}
