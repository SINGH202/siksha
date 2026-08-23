import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StickyCtaProps = {
  children: ReactNode;
  className?: string;
  /** Match PageMain / AppHeader content width on desktop */
  narrow?: boolean;
  /** Use when the page already has an inline desktop CTA (Airbnb rail). */
  mobileOnly?: boolean;
};

/**
 * Marketplace action chrome:
 * - Mobile: full-width bar above the tab nav (Airbnb reserve bar).
 * - Desktop: in-flow after content, never a floating island.
 */
export function StickyCta({
  children,
  className,
  narrow = false,
  mobileOnly = false,
}: StickyCtaProps) {
  return (
    <>
      <div
        className={cn("h-[4.75rem] shrink-0", mobileOnly ? "md:hidden" : "md:h-0")}
        aria-hidden
      />
      <div
        className={cn(
          "fixed inset-x-0 z-30 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl",
          "bottom-[calc(var(--app-bottom-nav)+env(safe-area-inset-bottom,0px))]",
          mobileOnly
            ? "md:hidden"
            : "md:static md:inset-auto md:mx-auto md:w-full md:border-0 md:bg-transparent md:px-8 md:py-0 md:pb-10 md:backdrop-blur-none lg:px-10",
          !mobileOnly && (narrow ? "md:max-w-2xl" : "md:max-w-6xl"),
          className
        )}
      >
        <div className={cn(!mobileOnly && !narrow && "md:ml-auto md:max-w-md")}>
          {children}
        </div>
      </div>
    </>
  );
}
