import type { PublicUser } from "@/lib/api/types";

const ACCESS_KEY = "siksha.auth.accessToken";
const REFRESH_KEY = "siksha.auth.refreshToken";
const USER_KEY = "siksha.auth.user";

export type SessionSnapshot = {
  accessToken: string | null;
  refreshToken: string | null;
  user: PublicUser | null;
};

export const EMPTY_SESSION: SessionSnapshot = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

let cachedSession: SessionSnapshot = EMPTY_SESSION;

function canUseStorage() {
  return typeof window !== "undefined";
}

function usersEqual(a: PublicUser | null, b: PublicUser | null) {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.id === b.id && a.phone === b.phone && a.role === b.role;
}

function rememberSession(next: SessionSnapshot): SessionSnapshot {
  if (
    cachedSession.accessToken === next.accessToken &&
    cachedSession.refreshToken === next.refreshToken &&
    usersEqual(cachedSession.user, next.user)
  ) {
    return cachedSession;
  }
  cachedSession = next;
  return cachedSession;
}

export function getAccessToken(): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function getUser(): PublicUser | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PublicUser;
  } catch {
    return null;
  }
}

export function getSession(): SessionSnapshot {
  if (!canUseStorage()) return EMPTY_SESSION;
  return rememberSession({
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    user: getUser(),
  });
}

export function setSession(input: {
  accessToken: string;
  refreshToken?: string;
  user: PublicUser;
}) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ACCESS_KEY, input.accessToken);
  if (input.refreshToken) {
    window.localStorage.setItem(REFRESH_KEY, input.refreshToken);
  }
  window.localStorage.setItem(USER_KEY, JSON.stringify(input.user));
  rememberSession({
    accessToken: input.accessToken,
    refreshToken: input.refreshToken ?? getRefreshToken(),
    user: input.user,
  });
  window.dispatchEvent(new Event("siksha:auth"));
}

export function setAccessToken(accessToken: string, user?: PublicUser) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ACCESS_KEY, accessToken);
  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  rememberSession({
    accessToken,
    refreshToken: getRefreshToken(),
    user: user ?? getUser(),
  });
  window.dispatchEvent(new Event("siksha:auth"));
}

export function clearSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  window.localStorage.removeItem(USER_KEY);
  cachedSession = EMPTY_SESSION;
  window.dispatchEvent(new Event("siksha:auth"));
}

export function homePathForRole(role: PublicUser["role"]): string {
  if (role === "teacher") return "/teacher/home";
  if (role === "parent") return "/parent/home";
  return "/role";
}
