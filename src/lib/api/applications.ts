import { apiRequest } from "@/lib/api/client";
import type {
  Application,
  CreateApplicationInput,
  Requirement,
  RequirementApplication,
} from "@/lib/api/types";

export function getLeads(signal?: AbortSignal) {
  return apiRequest<Requirement[]>("/leads", { signal });
}

export function applyToRequirement(
  requirementId: string,
  input: CreateApplicationInput
) {
  return apiRequest<Application>(
    `/requirements/${requirementId}/applications`,
    { method: "POST", body: input }
  );
}

export function getRequirementApplications(
  requirementId: string,
  signal?: AbortSignal
) {
  return apiRequest<RequirementApplication[]>(
    `/requirements/${requirementId}/applications`,
    { signal }
  );
}
