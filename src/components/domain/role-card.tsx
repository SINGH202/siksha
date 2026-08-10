import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { Typography } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RoleCardProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
};

export function RoleCard({
  href,
  title,
  description,
  icon: Icon,
  className,
}: RoleCardProps) {
  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          "group flex items-center gap-4 border-border/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lift active:translate-y-0",
          className
        )}
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-soft">
          <Icon className="size-6" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <Typography variant="h3" className="text-base tracking-tight text-primary">
            {title}
          </Typography>
          <Typography variant="muted" className="text-sm">
            {description}
          </Typography>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          <ArrowRight className="size-4" />
        </span>
      </Card>
    </Link>
  );
}
