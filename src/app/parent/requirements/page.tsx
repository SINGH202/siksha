"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/domain/empty-state";
import { RequirementCard } from "@/components/domain/requirement-card";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { useMyRequirements } from "@/hooks/use-requirements";
import { toUiRequirement } from "@/lib/api/mappers";
import { cn } from "@/lib/utils";
import { ClipboardList } from "lucide-react";

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
      />
      <PageMain>
        <SectionHeader
          title="Your requirements"
          description="Track applicants and chat with tutors"
          action={
            <Link
              href="/parent/requirements/new"
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full px-3 md:h-10 md:rounded-xl md:px-4",
              )}>
              <Typography variant="button" className="text-primary-foreground">
                New
              </Typography>
            </Link>
          }
        />
        {loading ? (
          <Typography variant="muted">Loading requirements…</Typography>
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
