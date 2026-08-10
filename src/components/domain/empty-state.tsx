import type { LucideIcon } from "lucide-react";

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-card/70 px-6 py-12 text-center shadow-soft",
        className
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-soft">
        <Icon className="size-6" />
      </span>
      <Typography variant="h3" className="text-base tracking-tight">
        {title}
      </Typography>
      <Typography variant="muted" className="max-w-xs">
        {description}
      </Typography>
      {actionLabel && onAction ? (
        <Button className="mt-2 h-11 px-5" onClick={onAction}>
          <Typography variant="button" className="text-primary-foreground">
            {actionLabel}
          </Typography>
        </Button>
      ) : null}
    </div>
  );
}
