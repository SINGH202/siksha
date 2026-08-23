import { presignUpload } from "@/lib/api/uploads";
import { validateUploadFile } from "@/lib/uploads/validate-upload-file";
import { ApiError } from "@/lib/api/client";
import type { UploadPurpose } from "@/lib/api/types";

export async function uploadTeacherFile(purpose: UploadPurpose, file: File) {
  const invalid = validateUploadFile(file);
  if (invalid) {
    throw new ApiError({
      statusCode: 400,
      code: invalid.code,
      message: invalid.message,
    });
  }

  const presign = await presignUpload({
    purpose,
    contentType: file.type,
    contentLength: file.size,
  });

  const put = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!put.ok) {
    throw new ApiError({
      statusCode: put.status,
      code: "UPLOAD_PUT_FAILED",
      message: "Could not upload the image. Try again.",
    });
  }

  return { objectKey: presign.objectKey, contentType: presign.contentType };
}
