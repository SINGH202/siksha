import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  setSession,
} from "@/lib/auth/session";
import type { ApiErrorBody, AuthTokensResponse } from "@/lib/api/types";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.statusCode = body.statusCode;
    this.code = body.code;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
  /** Skip 401 refresh retry (used by refresh itself). */
  skipRefresh?: boolean;
};

function apiBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) {
    throw new ApiError({
      statusCode: 500,
      code: "CONFIG",
      message: "NEXT_PUBLIC_API_URL is not configured",
    });
  }
  return base;
}

function v1(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl()}/api/v1${normalized}`;
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as Partial<ApiErrorBody>;
    return new ApiError({
      statusCode: body.statusCode ?? response.status,
      code: body.code ?? (response.statusText || "Error"),
      message: body.message ?? "Request failed",
    });
  } catch {
    return new ApiError({
      statusCode: response.status,
      code: response.statusText || "Error",
      message: "Request failed",
    });
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(v1("/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      clearSession();
      return false;
    }
    const data = (await response.json()) as AuthTokensResponse;
    setSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });
    return true;
  } catch {
    clearSession();
    return false;
  }
}

function enqueueRefresh() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = true, signal, skipRefresh = false } =
    options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(v1(path), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  if (response.status === 401 && auth && !skipRefresh) {
    const refreshed = await enqueueRefresh();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, skipRefresh: true });
    }
    throw new ApiError({
      statusCode: 401,
      code: "Unauthorized",
      message: "Session expired. Please sign in again.",
    });
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function checkHealth(signal?: AbortSignal) {
  const response = await fetch(`${apiBaseUrl()}/health`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw await parseError(response);
  }
  return (await response.json()) as { status: string };
}
