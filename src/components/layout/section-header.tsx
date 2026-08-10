import type { ReactNode } from "react";

import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-between gap-3",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <Typography variant="h3" className="text-base md:text-lg">
          {title}
        </Typography>
        {description ? (
          <Typography variant="muted" className="text-sm">
            {description}
          </Typography>
        ) : null}
      </div>
      {action}
    </div>
  );
}
