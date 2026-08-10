import type { Requirement as ApiRequirement } from "@/lib/api/types";
import type { Requirement as UiRequirement } from "@/lib/mock-data";

function formatPostedAgo(iso: string): string {
  const created = new Date(iso).getTime();
  if (Number.isNaN(created)) return "Recently";
  const diffMs = Date.now() - created;
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Adapt API requirement → existing RequirementCard model. */
export function toUiRequirement(
  requirement: ApiRequirement,
  applicantCount = 0
): UiRequirement {
  return {
    id: requirement.id,
    title: requirement.title,
    classLabel: `Class ${requirement.classLabel}`,
    board: requirement.board ?? "",
    subjects: requirement.subjects,
    locality: requirement.locality,
    mode: requirement.mode,
    schedule: requirement.schedule,
    scheduleDetail: requirement.scheduleDetail ?? "",
    note: requirement.note ?? undefined,
    status: requirement.status,
    applicantCount,
    postedAgo: formatPostedAgo(requirement.createdAt),
    budget: requirement.budget ?? undefined,
  };
}
