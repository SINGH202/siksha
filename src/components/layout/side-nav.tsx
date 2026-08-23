"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, Settings2 } from "lucide-react";

import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { getNavItems } from "@/lib/nav-items";
import type { UserRole } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type SideNavProps = {
  role: UserRole;
};

export function SideNav({ role }: SideNavProps) {
  const pathname = usePathname();
  const items = getNavItems(role, "desktop");
  const switchHref = role === "parent" ? "/login?role=teacher" : "/login?role=parent";
  const switchLabel =
    role === "parent" ? "Switch to teacher" : "Switch to parent";

  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 flex-col border-r border-border/60 bg-card/95 shadow-soft backdrop-blur-sm",
        "md:sticky md:top-0 md:flex md:h-dvh md:max-h-dvh md:self-start md:overflow-y-auto"
      )}
    >
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-soft">
          S
        </span>
        <div className="min-w-0">
          <Typography variant="h3" className="truncate text-base tracking-tight text-primary">
            Siksha
          </Typography>
          <Typography variant="small" className="truncate">
            Farrukhabad marketplace
          </Typography>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                active
                  ? "bg-accent text-accent-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
              <Typography
                variant="bodySmall"
                className={cn(
                  "font-medium",
                  active ? "text-accent-foreground" : "text-inherit"
                )}
              >
                {item.desktopLabel}
              </Typography>
              {item.badge ? (
                <span className="ml-auto size-2 rounded-full bg-destructive" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-border/60 px-3 pb-6 pt-4">
        <Link
          href={role === "parent" ? "/parent/help" : "/teacher/help"}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
            pathname.includes("/help")
              ? "bg-accent text-accent-foreground shadow-soft"
              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          <HelpCircle className="size-5" />
          <Typography
            variant="bodySmall"
            className={cn(
              "font-medium",
              pathname.includes("/help")
                ? "text-accent-foreground"
                : "text-inherit"
            )}
          >
            Help center
          </Typography>
        </Link>
        <Link
          href={role === "parent" ? "/parent/settings" : "/teacher/settings"}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
            pathname.includes("/settings")
              ? "bg-accent text-accent-foreground shadow-soft"
              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          <Settings2 className="size-5" />
          <Typography
            variant="bodySmall"
            className={cn(
              "font-medium",
              pathname.includes("/settings")
                ? "text-accent-foreground"
                : "text-inherit"
            )}
          >
            Settings
          </Typography>
        </Link>
        <Link
          href={switchHref}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-2 h-10 w-full"
          )}
        >
          <Typography variant="button">{switchLabel}</Typography>
        </Link>
      </div>
    </aside>
  );
}
