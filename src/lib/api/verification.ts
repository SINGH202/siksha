import { apiRequest } from "@/lib/api/client";
import type {
  TeacherProfile,
  VerificationMe,
  VerificationSubmissionSummary,
} from "@/lib/api/types";

export function getVerificationMe(signal?: AbortSignal) {
  return apiRequest<VerificationMe>("/verification/me", { signal });
}

export function submitVerification(objectKey: string) {
  return apiRequest<{
    profile: TeacherProfile;
    submission: VerificationSubmissionSummary & { objectKey?: string };
  }>("/verification/submit", {
    method: "POST",
    body: { objectKey },
  });
}
