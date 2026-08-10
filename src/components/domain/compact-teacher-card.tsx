import Link from "next/link";
import { Star } from "lucide-react";

import { VerifiedBadge } from "@/components/domain/status-badge";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { Teacher } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type CompactTeacherCardProps = {
  teacher: Teacher;
  href: string;
  className?: string;
};

export function CompactTeacherCard({
  teacher,
  href,
  className,
}: CompactTeacherCardProps) {
  const initials = teacher.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          "flex-row items-center gap-3 border-border/50 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lift",
          className
        )}
      >
        <Avatar className="size-12 rounded-2xl ring-1 ring-black/5">
          <AvatarFallback
            className="rounded-2xl bg-accent text-accent-foreground"
            aria-label={`Profile photo placeholder for ${teacher.name}`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Typography variant="h3" className="truncate text-sm tracking-tight">
              {teacher.name}
            </Typography>
            {teacher.verified ? <VerifiedBadge className="h-5" /> : null}
          </div>
          <Typography variant="small" className="truncate">
            {teacher.subjects.slice(0, 2).join(", ")} · {teacher.experienceYears}y
          </Typography>
          {teacher.rating ? (
            <div className="flex items-center gap-1 text-warning-foreground">
              <Star className="size-3.5 fill-current" />
              <Typography variant="small" className="text-warning-foreground">
                {teacher.rating} ({teacher.reviewCount})
              </Typography>
            </div>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
