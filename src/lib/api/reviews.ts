import { apiRequest } from "@/lib/api/client";
import type {
  CreateReviewInput,
  Review,
  TeacherReviewListItem,
} from "@/lib/api/types";

export function createReview(input: CreateReviewInput) {
  return apiRequest<Review>("/reviews", {
    method: "POST",
    body: input,
  });
}

export function listTeacherReviews(teacherId: string, signal?: AbortSignal) {
  return apiRequest<TeacherReviewListItem[]>(
    `/teachers/${teacherId}/reviews`,
    { signal }
  );
}
