import { RequireAuth } from "@/components/auth/require-auth";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RequireAuth role="admin">
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
