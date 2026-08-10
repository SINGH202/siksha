import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { AppShell } from "@/components/layout/app-shell";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SideNav } from "@/components/layout/side-nav";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Teacher dashboard | Local tuition leads",
  description:
    "View matching Class 8–12 home tuition leads in Farrukhabad, apply, and chat with parents on Siksha.",
  path: "/teacher/home",
  noIndex: true,
});

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuth role="teacher">
      <AppShell withBottomNav sidebar={<SideNav role="teacher" />}>
        {children}
        <BottomNav role="teacher" />
      </AppShell>
    </RequireAuth>
  );
}
