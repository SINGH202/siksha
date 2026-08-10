import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  className?: string;
  withBottomNav?: boolean;
  sidebar?: ReactNode;
  variant?: "app" | "auth";
};

export function AppShell({
  children,
  className,
  withBottomNav = false,
  sidebar,
  variant = "app",
}: AppShellProps) {
  if (variant === "auth") {
    return (
      <div className="min-h-dvh bg-background">
        <div
          className={cn(
            "relative mx-auto flex min-h-dvh w-full max-w-lg flex-col md:max-w-5xl md:flex-row md:items-stretch md:gap-8 md:px-8 md:py-12 lg:px-12",
            className
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <div
        className={cn(
          "relative mx-auto flex min-h-dvh w-full max-w-lg flex-col",
          "md:max-w-none md:flex-row md:items-start",
          withBottomNav && "pb-[5.5rem] md:pb-0",
          className
        )}
      >
        {sidebar}
        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

/** @deprecated Prefer AppShell — kept for gradual migration */
export function MobileShell(props: Omit<AppShellProps, "sidebar" | "variant">) {
  return <AppShell {...props} />;
}
