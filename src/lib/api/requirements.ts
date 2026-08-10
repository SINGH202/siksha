import { apiRequest } from "@/lib/api/client";
import type {
  CreateRequirementInput,
  Requirement,
  UpdateRequirementInput,
} from "@/lib/api/types";

export function createRequirement(input: CreateRequirementInput) {
  return apiRequest<Requirement>("/requirements", {
    method: "POST",
    body: input,
  });
}

export function getMyRequirements(signal?: AbortSignal) {
  return apiRequest<Requirement[]>("/requirements/mine", { signal });
}

export function getRequirement(id: string, signal?: AbortSignal) {
  return apiRequest<Requirement>(`/requirements/${id}`, { signal });
}

export function updateRequirement(id: string, input: UpdateRequirementInput) {
  return apiRequest<Requirement>(`/requirements/${id}`, {
    method: "PATCH",
    body: input,
  });
}
