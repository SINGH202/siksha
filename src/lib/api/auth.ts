import { apiRequest } from "@/lib/api/client";
import type {
  AuthTokensResponse,
  RequestOtpResponse,
  SetRoleResponse,
  UserRole,
} from "@/lib/api/types";

export function requestOtp(phone: string) {
  return apiRequest<RequestOtpResponse>("/auth/otp/request", {
    method: "POST",
    body: { phone },
    auth: false,
  });
}

export function verifyOtp(phone: string, code: string) {
  return apiRequest<AuthTokensResponse>("/auth/otp/verify", {
    method: "POST",
    body: { phone, code },
    auth: false,
  });
}

export function refreshSession(refreshToken: string) {
  return apiRequest<AuthTokensResponse>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    auth: false,
    skipRefresh: true,
  });
}

export function setRole(role: UserRole) {
  return apiRequest<SetRoleResponse>("/auth/role", {
    method: "POST",
    body: { role },
  });
}
