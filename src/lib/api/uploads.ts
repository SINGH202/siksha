import { apiRequest } from "@/lib/api/client";
import type { PresignUploadInput, PresignUploadResult } from "@/lib/api/types";

export function presignUpload(input: PresignUploadInput) {
  return apiRequest<PresignUploadResult>("/uploads/presign", {
    method: "POST",
    body: input,
  });
}
