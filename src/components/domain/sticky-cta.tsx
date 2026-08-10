import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StickyCtaProps = {
  children: ReactNode;
  className?: string;
  /** Match PageMain / AppHeader content width */
  narrow?: boolean;
};

export function StickyCta({ children, className, narrow = false }: StickyCtaProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 border-t border-border/50 bg-background/90 p-4 shadow-[0_-8px_24px_rgb(23_23_23/4%)] backdrop-blur-xl safe-bottom",
        "md:static md:mx-auto md:w-full md:border-0 md:bg-transparent md:px-8 md:pt-0 md:pb-8 md:shadow-none lg:px-10",
        narrow ? "md:max-w-2xl" : "md:max-w-6xl",
        className
      )}
    >
      <div className={cn(narrow ? "md:w-full" : "md:ml-auto md:max-w-md")}>
        {children}
      </div>
    </div>
  );
}
