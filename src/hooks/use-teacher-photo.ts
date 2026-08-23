"use client";

import { useCallback, useState } from "react";

import * as profilesApi from "@/lib/api/profiles";
import { uploadTeacherFile } from "@/lib/uploads/put-to-r2";

type ReloadProfile = (signal?: AbortSignal) => Promise<unknown>;

export function useTeacherPhoto(reloadProfile: ReloadProfile) {
  const [uploading, setUploading] = useState(false);

  const uploadPhoto = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const { objectKey } = await uploadTeacherFile("teacher_photo", file);
        await profilesApi.confirmTeacherPhoto(objectKey);
        await reloadProfile();
      } finally {
        setUploading(false);
      }
    },
    [reloadProfile]
  );

  const removePhoto = useCallback(async () => {
    setUploading(true);
    try {
      await profilesApi.removeTeacherPhoto();
      await reloadProfile();
    } finally {
      setUploading(false);
    }
  }, [reloadProfile]);

  return { uploading, uploadPhoto, removePhoto };
}
