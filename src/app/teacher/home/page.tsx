"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { RequirementCard } from "@/components/domain/requirement-card";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLeads } from "@/hooks/use-leads";
import { useProfile } from "@/hooks/use-profile";
import { toUiRequirement } from "@/lib/api/mappers";
import { cn } from "@/lib/utils";

export default function TeacherHomePage() {
  const { data, isComplete } = useProfile();
  const { items, loading } = useLeads();
  const firstName =
    data?.user.role === "teacher" && data.profile?.name
      ? data.profile.name.split(" ")[0]
      : null;
  const greeting = firstName ? `Namaste, ${firstName}` : "Namaste";

  return (
    <>
      <AppHeader
        showNotifications
        notificationsHref="/teacher/settings"
        title="Dashboard"
        hideDesktopTitle
      />
      <PageMain>
        <div className="space-y-1.5 md:hidden">
          <Typography variant="h2" className="tracking-tight">
            {greeting}
          </Typography>
          <Typography variant="muted">
            New home-tuition leads near you in Farrukhabad.
          </Typography>
        </div>

        <Card className="hidden gap-0 overflow-hidden border-border/40 p-0 md:block">
          <div className="flex flex-col justify-between gap-6 p-8 lg:flex-row lg:items-center lg:p-10">
            <div className="space-y-2">
              <Typography variant="h2" className="text-3xl tracking-tight">
                {greeting}
              </Typography>
              <Typography variant="muted" className="max-w-xl text-base">
                Review matching Class 8–12 home tuition leads and apply with
                your fee and availability.
              </Typography>
            </div>
            <Link
              href="/teacher/leads"
              className={cn(buttonVariants({ size: "lg" }), "shrink-0 px-5")}>
              <Typography variant="button" className="text-primary-foreground">
                View all leads
              </Typography>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Card>

        <Link
          href={isComplete ? "/teacher/verification" : "/teacher/profile/edit"}
          className="block md:max-w-xl">
          <Card className="flex-row items-center gap-3 border-secondary/40 bg-secondary/35 p-4 shadow-none transition-all duration-200 hover:border-secondary/60 hover:shadow-soft">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-card text-secondary-foreground shadow-soft">
              <BadgeCheck className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <Typography variant="h3" className="text-sm tracking-tight">
                {isComplete
                  ? "Profile ready for leads"
                  : "Complete your profile"}
              </Typography>
              <Typography variant="small">
                {isComplete
                  ? "You can apply to open requirements that match you."
                  : "Add subjects, classes, and areas to unlock matching."}
              </Typography>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </Card>
        </Link>

        <section className="space-y-4">
          <SectionHeader
            title="Leads for you"
            description="Matched to your subjects and locality"
            action={
              <Link
                href="/teacher/leads"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "h-auto p-0 md:hidden",
                )}>
                <Typography variant="link">See all</Typography>
              </Link>
            }
          />
          {loading ? (
            <Typography variant="muted">Loading leads…</Typography>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {items.slice(0, 4).map((lead) => (
                <RequirementCard
                  key={lead.id}
                  requirement={toUiRequirement(lead)}
                  href={`/teacher/leads/${lead.id}`}
                  className="h-full"
                />
              ))}
              {items.length === 0 ? (
                <Typography variant="muted">
                  No open leads match your profile yet.
                </Typography>
              ) : null}
            </div>
          )}
        </section>
      </PageMain>
    </>
  );
}
