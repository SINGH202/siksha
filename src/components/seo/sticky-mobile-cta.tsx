"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StickyMobileCtaProps = {
  href?: string;
  label?: string;
};

export function StickyMobileCta({
  href = "/role",
  label = "Find a tutor / Post need",
}: StickyMobileCtaProps) {
  const pathname = usePathname();
  const isMarketingSurface =
    pathname === "/" ||
    pathname === "/role" ||
    pathname === "/privacy" ||
    pathname.startsWith("/privacy/");

  if (!isMarketingSurface) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-3 md:hidden">
      <Link
        href={href}
        className={cn(
          buttonVariants(),
          "pointer-events-auto flex h-12 w-full items-center justify-center gap-2 rounded-2xl shadow-lg"
        )}
      >
        <Plus className="size-4" aria-hidden />
        <Typography variant="button" className="text-primary-foreground">
          {label}
        </Typography>
      </Link>
    </div>
  );
}
