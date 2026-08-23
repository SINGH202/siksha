import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageMainProps = {
  children: ReactNode;
  className?: string;
  /** Constrain readable width on very wide screens */
  narrow?: boolean;
};

export function PageMain({
  children,
  className,
  narrow = false,
}: PageMainProps) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full flex-col gap-5 px-4 py-5",
        "md:gap-6 md:px-8 md:py-6 lg:px-10",
        narrow ? "max-w-2xl" : "max-w-6xl",
        className,
      )}>
      {children}
    </main>
  );
}
