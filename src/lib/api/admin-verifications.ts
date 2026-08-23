import { apiRequest } from "@/lib/api/client";
import type { VerificationQueueItem } from "@/lib/api/types";

export function listAdminVerifications(
  status: "pending" | "approved" | "rejected" = "pending",
  signal?: AbortSignal,
) {
  const query = status ? `?status=${status}` : "";
  return apiRequest<VerificationQueueItem[]>(`/admin/verifications${query}`, {
    signal,
  });
}

export function getAdminDocumentUrl(id: string) {
  return apiRequest<{ documentUrl: string }>(
    `/admin/verifications/${id}/document-url`,
  );
}

export function approveVerification(id: string) {
  return apiRequest(`/admin/verifications/${id}/approve`, { method: "POST" });
}

export function rejectVerification(id: string, reason?: string) {
  return apiRequest(`/admin/verifications/${id}/reject`, {
    method: "POST",
    body: reason ? { reason } : {},
  });
}
