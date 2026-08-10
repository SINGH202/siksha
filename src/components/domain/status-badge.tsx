import { BadgeCheck } from "lucide-react";

import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RequirementStatus } from "@/lib/mock-data";

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-6 gap-1 bg-success text-success-foreground hover:bg-success",
        className
      )}
    >
      <BadgeCheck className="size-3.5" />
      <Typography variant="small" className="text-success-foreground">
        Verified
      </Typography>
    </Badge>
  );
}

const statusStyles: Record<
  RequirementStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-muted text-muted-foreground",
  },
  applicants: {
    label: "Applicants",
    className: "bg-success text-success-foreground",
  },
  hired: {
    label: "Hired",
    className: "bg-accent text-accent-foreground",
  },
  closed: {
    label: "Closed",
    className: "bg-muted text-muted-foreground",
  },
};

type StatusBadgeProps = {
  status: RequirementStatus;
  applicantCount?: number;
  className?: string;
};

export function StatusBadge({
  status,
  applicantCount,
  className,
}: StatusBadgeProps) {
  const config = statusStyles[status];
  const label =
    status === "applicants" && applicantCount
      ? `${applicantCount} Applicants`
      : config.label;

  return (
    <Badge className={cn("h-6", config.className, className)} variant="secondary">
      <Typography variant="small" className="text-inherit">
        {label}
      </Typography>
    </Badge>
  );
}
