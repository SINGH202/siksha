import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("w-full", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight
                  className="size-3.5 text-muted-foreground"
                  aria-hidden
                />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  <Typography variant="link">{item.label}</Typography>
                </Link>
              ) : (
                <Typography
                  variant="small"
                  className={isLast ? "text-foreground" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </Typography>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
