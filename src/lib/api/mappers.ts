import type {
  ConversationListItem,
  Requirement as ApiRequirement,
} from "@/lib/api/types";
import type { Requirement as UiRequirement } from "@/lib/mock-data";

export type UiChatPreview = {
  id: string;
  name: string;
  roleLabel: "Teacher" | "Parent";
  lastMessage: string;
  time: string;
  requirementLabel: string;
  unread?: boolean;
};

export function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatActivityTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return formatMessageTime(iso);
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function toChatPreview(
  item: ConversationListItem,
  viewerRole: "parent" | "teacher"
): UiChatPreview {
  return {
    id: item.id,
    name: item.peerName?.trim() || "User",
    roleLabel: viewerRole === "parent" ? "Teacher" : "Parent",
    lastMessage: item.lastMessage?.body ?? "No messages yet",
    time: formatActivityTime(item.lastActivityAt),
    requirementLabel: "Tuition chat",
  };
}

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
