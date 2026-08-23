"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardList, Plus } from "lucide-react";

import { EmptyState } from "@/components/domain/empty-state";
import { RequirementCard } from "@/components/domain/requirement-card";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyRequirements } from "@/hooks/use-requirements";
import { toUiRequirement } from "@/lib/api/mappers";
import { cn } from "@/lib/utils";

export default function ParentRequirementsPage() {
  const router = useRouter();
  const { items, loading, error } = useMyRequirements();

  return (
    <>
      <AppHeader
        title="Requirements"
        showBrand={false}
        backHref="/parent/home"
        subtitle="Track applicants and chat with tutors"
        rightSlot={
          <Link
            href="/parent/requirements/new"
            className={cn(buttonVariants({ size: "sm" }), "h-9")}>
            <Plus className="size-3.5" aria-hidden />
            <Typography variant="button" className="text-primary-foreground">
              Post
            </Typography>
          </Link>
        }
      />
      <PageMain>
        {loading ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Card key={index} className="gap-3 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </Card>
            ))}
          </div>
        ) : null}
        {error ? (
          <Typography variant="muted" className="text-destructive">
            {error}
          </Typography>
        ) : null}
        {!loading && !error && items.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No requirements yet"
            description="Post your first Class 8–12 home tuition requirement."
            actionLabel="Post requirement"
            onAction={() => {
              router.push("/parent/requirements/new");
            }}
          />
        ) : null}
        <div className="grid gap-3 lg:grid-cols-2">
          {items.map((requirement) => (
            <RequirementCard
              key={requirement.id}
              requirement={toUiRequirement(requirement)}
              href={`/parent/requirements/${requirement.id}`}
              className="h-full"
            />
          ))}
        </div>
      </PageMain>
    </>
  );
}
