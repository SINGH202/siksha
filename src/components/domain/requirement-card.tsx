import Link from "next/link";
import { Clock3, Laptop, MapPin } from "lucide-react";

import { StatusBadge } from "@/components/domain/status-badge";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Requirement } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type RequirementCardProps = {
  requirement: Requirement;
  href: string;
  className?: string;
};

export function RequirementCard({
  requirement,
  href,
  className,
}: RequirementCardProps) {
  const ModeIcon = requirement.mode === "online" ? Laptop : MapPin;

  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          "gap-3.5 border-border/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <Typography variant="h3" className="text-base tracking-tight">
            {requirement.title}
          </Typography>
          <StatusBadge
            status={requirement.status}
            applicantCount={requirement.applicantCount}
          />
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <ModeIcon className="size-4 shrink-0" />
          <Typography variant="muted" className="text-sm">
            {requirement.locality}
            {requirement.mode === "home" ? " · In-person" : " · Online"}
          </Typography>
        </div>

        <Separator className="opacity-60" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock3 className="size-3.5" />
            <Typography variant="small">Posted {requirement.postedAgo}</Typography>
          </div>

          {requirement.applicantCount > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {Array.from({
                  length: Math.min(requirement.applicantCount, 3),
                }).map((_, index) => (
                  <Avatar key={index} className="size-7 border-2 border-card">
                    <AvatarFallback className="bg-accent text-[10px] text-accent-foreground">
                      T{index + 1}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Typography variant="small">
                +{requirement.applicantCount}
              </Typography>
            </div>
          ) : (
            <Typography variant="small">Awaiting matches</Typography>
          )}
        </div>
      </Card>
    </Link>
  );
}
