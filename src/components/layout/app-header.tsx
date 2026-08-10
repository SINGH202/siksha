import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, ChevronLeft, Menu } from "lucide-react";

import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  title?: string;
  showBrand?: boolean;
  showMenu?: boolean;
  showNotifications?: boolean;
  /** Hide the desktop title row (mobile chrome still shows). */
  hideDesktopTitle?: boolean;
  backHref?: string;
  className?: string;
  rightSlot?: ReactNode;
  /** Optional desktop subtitle under title */
  subtitle?: string;
  /** Match PageMain width so title aligns with content */
  narrow?: boolean;
};

export function AppHeader({
  title,
  showBrand = true,
  showMenu = false,
  showNotifications = false,
  hideDesktopTitle = false,
  backHref,
  className,
  rightSlot,
  subtitle,
  narrow = false,
}: AppHeaderProps) {
  const showDesktopTitleBlock = !hideDesktopTitle && (Boolean(title) || showBrand);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full items-center gap-2 px-4",
          subtitle && !hideDesktopTitle ? "min-h-14 py-2.5 md:min-h-16 md:py-3" : "h-14 md:h-16",
          "md:px-8 lg:px-10",
          narrow ? "max-w-2xl" : "max-w-6xl"
        )}
      >
        <div className="flex w-10 shrink-0 items-center justify-start md:w-auto md:min-w-0">
          {backHref ? (
            <Link
              href={backHref}
              aria-label="Go back"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-10 md:hidden"
              )}
            >
              <ChevronLeft className="size-5" />
            </Link>
          ) : null}
          {showMenu ? (
            <button
              type="button"
              aria-label="Menu"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-10 md:hidden"
              )}
            >
              <Menu className="size-5" />
            </button>
          ) : null}
          {showDesktopTitleBlock ? (
            <div className="hidden min-w-0 md:block">
              {title && !showBrand ? (
                <div className="space-y-0.5">
                  <Typography variant="h3" className="text-lg tracking-tight">
                    {title}
                  </Typography>
                  {subtitle ? (
                    <Typography variant="small">{subtitle}</Typography>
                  ) : null}
                </div>
              ) : showBrand ? (
                <Typography variant="h3" className="text-lg tracking-tight text-primary">
                  {title ?? "Dashboard"}
                </Typography>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 items-center justify-center md:hidden">
          {showBrand ? (
            <Typography variant="h3" className="text-lg tracking-tight text-primary">
              Siksha
            </Typography>
          ) : title ? (
            <Typography variant="h3" className="text-base tracking-tight">
              {title}
            </Typography>
          ) : null}
        </div>

        <div className="ml-auto flex shrink-0 items-center justify-end gap-1">
          {rightSlot}
          {showNotifications ? (
            <button
              type="button"
              aria-label="Notifications"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-10"
              )}
            >
              <Bell className="size-5" />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
