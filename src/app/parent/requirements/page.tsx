import Link from "next/link";

import { RequirementCard } from "@/components/domain/requirement-card";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { parentRequirements } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ParentRequirementsPage() {
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
                "rounded-full px-3 md:h-10 md:rounded-xl md:px-4"
              )}
            >
              <Typography variant="button" className="text-primary-foreground">
                New
              </Typography>
            </Link>
          }
        />
        <div className="grid gap-3 lg:grid-cols-2">
          {parentRequirements.map((requirement) => (
            <RequirementCard
              key={requirement.id}
              requirement={requirement}
              href={`/parent/requirements/${requirement.id}`}
              className="h-full"
            />
          ))}
        </div>
      </PageMain>
    </>
  );
}
