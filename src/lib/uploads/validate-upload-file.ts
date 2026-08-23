export const UPLOAD_MAX_BYTES = 2_097_152;
export const UPLOAD_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type UploadFileLike = { type: string; size: number };

export type UploadValidationError = {
  code: "UPLOAD_INVALID_TYPE" | "UPLOAD_TOO_LARGE" | "UPLOAD_INVALID_SIZE";
  message: string;
};

export function validateUploadFile(file: UploadFileLike): UploadValidationError | null {
  if (!Number.isFinite(file.size) || file.size < 1) {
    return {
      code: "UPLOAD_INVALID_SIZE",
      message: "Choose an image file",
    };
  }
  if (!(UPLOAD_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return {
      code: "UPLOAD_INVALID_TYPE",
      message: "Use a JPEG, PNG, or WebP image",
    };
  }
  if (file.size > UPLOAD_MAX_BYTES) {
    return {
      code: "UPLOAD_TOO_LARGE",
      message: "Image must be 2MB or smaller",
    };
  }
  return null;
}
