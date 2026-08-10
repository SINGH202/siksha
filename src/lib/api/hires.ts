import { apiRequest } from "@/lib/api/client";
import type { CreateHireInput, Hire, HireListItem } from "@/lib/api/types";

export function createHire(input: CreateHireInput) {
  return apiRequest<Hire>("/hires", {
    method: "POST",
    body: input,
  });
}

export function listMyHires(signal?: AbortSignal) {
  return apiRequest<HireListItem[]>("/hires/mine", { signal });
}
