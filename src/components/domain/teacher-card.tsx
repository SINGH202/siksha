import Link from "next/link";
import { BookOpen, Layers3 } from "lucide-react";

import { VerifiedBadge } from "@/components/domain/status-badge";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Teacher } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type TeacherCardProps = {
  teacher: Teacher;
  href: string;
  className?: string;
};

export function TeacherCard({ teacher, href, className }: TeacherCardProps) {
  const initials = teacher.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <Card
      className={cn(
        "gap-4 border-border/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift",
        className
      )}
    >
      <div className="flex gap-3.5">
        <Avatar className="size-16 rounded-2xl ring-1 ring-black/5">
          <AvatarFallback
            className="rounded-2xl bg-accent text-accent-foreground"
            aria-label={`Profile photo placeholder for ${teacher.name}, ${teacher.subjects.join(" and ")} tutor`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Typography variant="h3" className="text-base tracking-tight">
              {teacher.name}
            </Typography>
            {teacher.verified ? <VerifiedBadge /> : null}
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <BookOpen className="mt-0.5 size-4 shrink-0" />
            <Typography variant="muted" className="text-sm">
              {teacher.subjects.join(", ")}
              {teacher.board ? ` (${teacher.board})` : ""}
            </Typography>
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <Layers3 className="mt-0.5 size-4 shrink-0" />
            <Typography variant="muted" className="text-sm">
              {teacher.classes}
            </Typography>
          </div>
          <Typography variant="bodySmall" className="font-semibold text-primary">
            ₹{teacher.feeMin} – ₹{teacher.feeMax} / hour
          </Typography>
        </div>
      </div>
      <Link
        href={href}
        className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full")}
      >
        <Typography variant="button">View Profile</Typography>
      </Link>
    </Card>
  );
}
