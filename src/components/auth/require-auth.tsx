"use client";

import type { ReactNode } from "react";

import { useRequireAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/lib/api/types";
import { Typography } from "@/components/typography";

type RequireAuthProps = {
  role?: UserRole;
  allowNullRole?: boolean;
  children: ReactNode;
};

export function RequireAuth({
  role,
  allowNullRole,
  children,
}: RequireAuthProps) {
  const { ready } = useRequireAuth({ role, allowNullRole });

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Typography variant="muted">Checking session…</Typography>
      </div>
    );
  }

  return children;
}
