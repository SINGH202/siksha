import { Clock3 } from "lucide-react";

import { Typography } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type ResponseTimePromiseProps = {
  className?: string;
};

export function ResponseTimePromise({ className }: ResponseTimePromiseProps) {
  return (
    <Card
      className={cn(
        "flex-row items-start gap-3 border-secondary/50 bg-secondary/35 p-4 shadow-none",
        className,
      )}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-card text-secondary-foreground shadow-soft">
        <Clock3 className="size-5" aria-hidden />
      </span>
      <div className="space-y-1">
        <Typography variant="h3" className="text-sm tracking-tight">
          Response time promise
        </Typography>
        <Typography variant="muted">
          {siteConfig.responseTimePromise}
        </Typography>
      </div>
    </Card>
  );
}
