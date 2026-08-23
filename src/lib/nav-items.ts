import {
  ClipboardList,
  Home,
  MessageCircle,
  Search,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/lib/mock-data";

export type NavItem = {
  href: string;
  label: string;
  desktopLabel: string;
  icon: LucideIcon;
  badge?: boolean;
};

export const parentNavItems: NavItem[] = [
  {
    href: "/parent/home",
    label: "Home",
    desktopLabel: "Dashboard",
    icon: Home,
  },
  {
    href: "/parent/requirements",
    label: "Leads",
    desktopLabel: "Requirements",
    icon: ClipboardList,
  },
  {
    href: "/parent/browse",
    label: "Browse",
    desktopLabel: "Browse tutors",
    icon: Search,
  },
  {
    href: "/parent/chat",
    label: "Chat",
    desktopLabel: "Messages",
    icon: MessageCircle,
  },
  {
    href: "/parent/profile",
    label: "Profile",
    desktopLabel: "My profile",
    icon: UserRound,
  },
];

/** Mobile bottom nav stays at 4 items; browse is reached from home. */
export const parentMobileNavItems: NavItem[] = [
  parentNavItems[0],
  parentNavItems[1],
  parentNavItems[3],
  parentNavItems[4],
];

export const teacherNavItems: NavItem[] = [
  {
    href: "/teacher/home",
    label: "Home",
    desktopLabel: "Dashboard",
    icon: Home,
  },
  {
    href: "/teacher/leads",
    label: "Leads",
    desktopLabel: "Leads",
    icon: ClipboardList,
  },
  {
    href: "/teacher/chat",
    label: "Chat",
    desktopLabel: "Messages",
    icon: MessageCircle,
  },
  {
    href: "/teacher/profile",
    label: "Profile",
    desktopLabel: "My profile",
    icon: UserRound,
  },
];

export function getNavItems(role: UserRole, variant: "mobile" | "desktop") {
  if (role === "teacher") return teacherNavItems;
  return variant === "mobile" ? parentMobileNavItems : parentNavItems;
}
