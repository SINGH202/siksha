import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { AppShell } from "@/components/layout/app-shell";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SideNav } from "@/components/layout/side-nav";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Parent dashboard | Home tuition matching",
  description:
    "Manage tuition requirements, browse verified Farrukhabad tutors, and chat in-app on Siksha.",
  path: "/parent/home",
  noIndex: true,
});

export default function ParentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuth role="parent">
      <AppShell withBottomNav sidebar={<SideNav role="parent" />}>
        {children}
        <BottomNav role="parent" />
      </AppShell>
    </RequireAuth>
  );
}
