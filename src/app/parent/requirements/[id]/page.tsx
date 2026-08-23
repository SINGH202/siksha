"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, CalendarDays, MapPin, Quote } from "lucide-react";

import { EmptyState } from "@/components/domain/empty-state";
import { StatusBadge } from "@/components/domain/status-badge";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toastApiError } from "@/hooks/use-auth";
import { useConversations } from "@/hooks/use-conversations";
import { useRequirementDetail } from "@/hooks/use-requirements";
import { toUiRequirement } from "@/lib/api/mappers";
import type { RequirementApplication } from "@/lib/api/types";

export default function RequirementDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { create } = useConversations();
  const [openingChatId, setOpeningChatId] = useState<string | null>(null);
  const { requirement, applications, loading, error } = useRequirementDetail(
    params.id,
  );

  async function openChat(application: RequirementApplication) {
    if (!requirement) return;
    setOpeningChatId(application.id);
    try {
      const conversation = await create({
        requirementId: requirement.id,
        teacherId: application.teacherId,
      });
      router.push(`/parent/chat/${conversation.id}`);
    } catch (error) {
      toastApiError(error, "Could not open chat");
    } finally {
      setOpeningChatId(null);
    }
  }

  if (!loading && (error || !requirement)) {
    return (
      <>
        <AppHeader
          title="Requirement"
          showBrand={false}
          backHref="/parent/requirements"
        />
        <PageMain>
          <Typography variant="muted">
            {error || "Requirement not found."}
          </Typography>
        </PageMain>
      </>
    );
  }

  const ui = requirement
    ? toUiRequirement(requirement, applications.length)
    : null;

  return (
    <>
      <AppHeader
        title="Requirement"
        showBrand={false}
        backHref="/parent/requirements"
      />
      <PageMain>
        {loading || !ui || !requirement ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
            <Card className="gap-3 p-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </Card>
            <Card className="gap-3 p-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-16 w-full" />
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)] lg:items-start">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={ui.status}
                    applicantCount={applications.length}
                  />
                  <Typography variant="small">Posted {ui.postedAgo}</Typography>
                </div>
                <Typography
                  variant="h2"
                  className="text-xl tracking-tight md:text-2xl">
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
                      Class {requirement.classLabel}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="label">Board</Typography>
                    <Typography variant="bodySmall" className="font-medium">
                      {requirement.board || "—"}
                    </Typography>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {requirement.subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant="secondary"
                      className="h-7 bg-accent text-accent-foreground">
                      <Typography
                        variant="small"
                        className="text-accent-foreground">
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
                      {requirement.locality} ·{" "}
                      {requirement.mode === "home" ? "In-person" : "Online"}
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
                    {requirement.scheduleDetail ? (
                      <Typography variant="muted">
                        {requirement.scheduleDetail}
                      </Typography>
                    ) : null}
                  </div>
                </div>
              </Card>

              {requirement.note ? (
                <Card className="gap-2 border-0 bg-accent/70 p-4 shadow-none">
                  <div className="flex items-center gap-2 text-primary">
                    <Quote className="size-4" />
                    <Typography variant="h3" className="text-sm text-primary">
                      Your note
                    </Typography>
                  </div>
                  <Typography variant="muted" className="italic">
                    {requirement.note}
                  </Typography>
                </Card>
              ) : null}
            </div>

            <aside className="space-y-3">
              <SectionHeader title={`Applicants (${applications.length})`} />
              {applications.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No applications yet"
                  description="Matching teachers will appear here after they apply."
                />
              ) : (
                applications.map((application) => {
                  const profile = application.teacher.teacherProfile;
                  const name = profile?.name ?? "Teacher";
                  const initials = name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2);
                  return (
                    <Card
                      key={application.id}
                      className="gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-11 rounded-2xl">
                          <AvatarFallback className="rounded-2xl bg-accent">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <Typography
                            variant="h3"
                            className="truncate text-sm tracking-tight">
                            {name}
                          </Typography>
                          <Typography variant="small">
                            {profile?.subjects?.slice(0, 2).join(", ") ||
                              "Subjects pending"}
                            {application.proposedFee != null
                              ? ` · ₹${application.proposedFee}`
                              : ""}
                          </Typography>
                        </div>
                      </div>
                      <Typography variant="muted" className="text-sm">
                        {application.note}
                      </Typography>
                      <Button
                        variant="outline"
                        className="h-10 w-full"
                        disabled={openingChatId === application.id}
                        onClick={() => void openChat(application)}>
                        <Typography variant="button">Open chat</Typography>
                      </Button>
                    </Card>
                  );
                })
              )}
            </aside>
          </div>
        )}
      </PageMain>

    </>
  );
}
