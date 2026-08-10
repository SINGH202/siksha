"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@/components/typography";
import { getNavItems } from "@/lib/nav-items";
import type { UserRole } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type BottomNavProps = {
  role: UserRole;
};

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const items = getNavItems(role, "mobile");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/90 shadow-[0_-8px_24px_rgb(23_23_23/4%)] backdrop-blur-xl safe-bottom md:hidden">
      <div className="mx-auto flex h-[4.25rem] max-w-lg items-stretch justify-around px-1.5 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-[4.25rem] flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 transition-all duration-200",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-xl transition-all duration-200",
                  active && "bg-accent text-accent-foreground shadow-soft"
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.35 : 1.75} />
                {item.badge ? (
                  <span className="absolute top-1 right-1 size-2 rounded-full bg-destructive ring-2 ring-card" />
                ) : null}
              </span>
              <Typography
                variant="small"
                className={cn(
                  "text-[11px] leading-none",
                  active ? "font-semibold text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Typography>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
