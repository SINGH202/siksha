import { ShieldCheck } from "lucide-react";

import { Typography } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TrustBannerProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function TrustBanner({
  title = "Verified teachers only",
  description = "ID-checked tutors before they can apply to your requirements.",
  className,
}: TrustBannerProps) {
  return (
    <Card
      className={cn(
        "flex-row items-start gap-3 border-warning/30 bg-warning/25 p-4 shadow-none ring-0",
        className
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-warning-foreground shadow-soft">
        <ShieldCheck className="size-5" />
      </span>
      <div className="space-y-1">
        <Typography variant="h3" className="text-sm tracking-tight">
          {title}
        </Typography>
        <Typography variant="muted" className="text-sm">
          {description}
        </Typography>
      </div>
    </Card>
  );
}
