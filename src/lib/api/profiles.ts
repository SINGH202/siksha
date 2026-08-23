import { apiRequest } from "@/lib/api/client";
import type {
  ParentProfile,
  ProfileMeResponse,
  TeacherProfile,
  UpdateParentProfileInput,
  UpdateTeacherProfileInput,
} from "@/lib/api/types";

export function getMyProfile(signal?: AbortSignal) {
  return apiRequest<ProfileMeResponse>("/profiles/me", { signal });
}

export function updateParentProfile(input: UpdateParentProfileInput) {
  return apiRequest<{ profile: ParentProfile; isComplete: boolean }>(
    "/profiles/parent",
    { method: "PUT", body: input }
  );
}

export function updateTeacherProfile(input: UpdateTeacherProfileInput) {
  return apiRequest<{ profile: TeacherProfile; isComplete: boolean }>(
    "/profiles/teacher",
    { method: "PUT", body: input }
  );
}

export function confirmTeacherPhoto(objectKey: string) {
  return apiRequest<{ profile: TeacherProfile }>("/profiles/teacher/photo", {
    method: "PUT",
    body: { objectKey },
  });
}

export function removeTeacherPhoto() {
  return apiRequest<{ profile: TeacherProfile }>("/profiles/teacher/photo", {
    method: "DELETE",
  });
}

export function getTeacherPhotoUrl() {
  return apiRequest<{ photoUrl: string }>("/profiles/teacher/photo-url");
}
