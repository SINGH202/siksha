import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, CalendarDays, MapPin, Quote } from "lucide-react";

import { StatusBadge } from "@/components/domain/status-badge";
import { StickyCta } from "@/components/domain/sticky-cta";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { parentRequirements, teachers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RequirementDetailPage({ params }: PageProps) {
  const { id } = await params;
  const requirement =
    parentRequirements.find((item) => item.id === id) ?? parentRequirements[0];

  if (!requirement) notFound();

  const applicants = teachers.filter((teacher) => teacher.verified).slice(0, 3);

  return (
    <>
      <AppHeader
        title="Requirement"
        showBrand={false}
        backHref="/parent/requirements"
      />
      <PageMain>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)] lg:items-start">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={requirement.status}
                  applicantCount={requirement.applicantCount}
                />
                <Typography variant="small">
                  Posted {requirement.postedAgo}
                </Typography>
              </div>
              <Typography variant="h2" className="text-xl tracking-tight md:text-2xl">
                {requirement.title}
              </Typography>
            </div>

            <Card className="gap-3 p-4">
              <div className="flex items-center gap-2 text-primary">
                <BookOpen className="size-4" />
                <Typography variant="h3" className="text-sm text-primary">
                  Academic requirements
                </Typography>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Typography variant="label">Class</Typography>
                  <Typography variant="bodySmall" className="font-medium">
                    {requirement.classLabel}
                  </Typography>
                </div>
                <div>
                  <Typography variant="label">Board</Typography>
                  <Typography variant="bodySmall" className="font-medium">
                    {requirement.board}
                  </Typography>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {requirement.subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="secondary"
                    className="h-7 bg-accent text-accent-foreground"
                  >
                    <Typography variant="small" className="text-accent-foreground">
                      {subject}
                    </Typography>
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="gap-3 p-4">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 text-primary" />
                <div>
                  <Typography variant="label">Location</Typography>
                  <Typography variant="bodySmall" className="font-medium">
                    {requirement.locality}
                  </Typography>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 size-4 text-primary" />
                <div>
                  <Typography variant="label">Schedule</Typography>
                  <Typography variant="bodySmall" className="font-medium">
                    {requirement.schedule}
                  </Typography>
                  <Typography variant="muted">
                    {requirement.scheduleDetail}
                  </Typography>
                </div>
              </div>
            </Card>

            {requirement.note ? (
              <Card className="gap-2 border-0 bg-accent/70 p-4 shadow-none">
                <div className="flex items-center gap-2 text-primary">
                  <Quote className="size-4" />
                  <Typography variant="h3" className="text-sm text-primary">
                    Note from parent
                  </Typography>
                </div>
                <Typography variant="muted" className="italic">
                  {requirement.note}
                </Typography>
              </Card>
            ) : null}
          </div>

          <section className="space-y-3 lg:sticky lg:top-24">
            <SectionHeader title="Applicants" />
            {applicants.length === 0 ? (
              <Typography variant="muted">
                No applicants yet. Teachers usually reply within a day.
              </Typography>
            ) : (
              applicants.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="flex-row items-center gap-3 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift"
                >
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      {teacher.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <Typography variant="h3" className="text-sm">
                      {teacher.name}
                    </Typography>
                    <Typography variant="small">
                      ₹{teacher.feeMin}–{teacher.feeMax}/hr ·{" "}
                      {teacher.experienceYears}y exp
                    </Typography>
                  </div>
                  <Link
                    href="/parent/chat/c1"
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "rounded-full px-3"
                    )}
                  >
                    <Typography
                      variant="button"
                      className="text-primary-foreground"
                    >
                      Chat
                    </Typography>
                  </Link>
                </Card>
              ))
            )}
          </section>
        </div>
      </PageMain>

      <StickyCta>
        <Link
          href="/parent/browse"
          className={cn(buttonVariants({ variant: "outline" }), "h-12 w-full rounded-xl")}
        >
          <Typography variant="button">Browse more tutors</Typography>
        </Link>
      </StickyCta>
    </>
  );
}
