import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { AppShell } from "@/components/layout/app-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin verifications | Teacher ID review",
  description:
    "Review pending teacher ID documents and approve or reject verification requests on Siksha.",
  path: "/admin/verifications",
  noIndex: true,
});

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RequireAuth role="admin">
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
