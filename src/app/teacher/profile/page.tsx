"use client";

import Link from "next/link";
import {
  BadgeCheck,
  HelpCircle,
  IdCard,
  LogOut,
  MapPin,
  Pencil,
  Settings2,
  Shield,
} from "lucide-react";

import { VerifiedBadge } from "@/components/domain/status-badge";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { initialsFromName, useTeacherProfile } from "@/hooks/use-account";
import { cn } from "@/lib/utils";

export default function TeacherProfilePage() {
  const { value: profile, ready } = useTeacherProfile();
  const classesDisplay =
    profile.classes.length > 0
      ? `Classes ${[...profile.classes].sort((a, b) => Number(a) - Number(b)).join(", ")}`
      : "Classes not set";

  return (
    <>
      <AppHeader title="My profile" showBrand={false} />
      <PageMain>
        <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
          <Card className="gap-4 p-5 text-center md:p-6 lg:text-left">
            <div className="flex flex-col items-center gap-3 lg:items-start">
              <Avatar className="size-20 md:size-24">
                <AvatarFallback
                  className="bg-accent text-lg text-accent-foreground md:text-xl"
                  aria-label={`Profile photo placeholder for ${profile.name}`}
                >
                  {ready ? initialsFromName(profile.name) : "…"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  <Typography variant="h2" className="text-xl tracking-tight md:text-2xl">
                    {ready ? profile.name : "Loading…"}
                  </Typography>
                  <VerifiedBadge />
                </div>
                <Typography variant="muted">Teacher account</Typography>
              </div>
            </div>
            <div className="space-y-2 rounded-xl bg-muted/50 p-3 text-left">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0" aria-hidden />
                <Typography variant="bodySmall">
                  {profile.areas.join(", ") || "Add areas"}
                </Typography>
              </div>
              <Typography variant="bodySmall" className="font-medium">
                {profile.subjects.join(", ") || "Add subjects"} · {classesDisplay}
              </Typography>
              <Typography variant="small">
                ₹{profile.feeMin}–{profile.feeMax} / hour · {profile.experienceYears}y
                exp
              </Typography>
              {profile.bio ? (
                <Typography variant="muted" className="text-sm">
                  {profile.bio}
                </Typography>
              ) : null}
            </div>
            <Link
              href="/teacher/profile/edit"
              className={cn(buttonVariants(), "h-11 w-full rounded-xl")}
            >
              <Pencil className="size-4" aria-hidden />
              <Typography variant="button" className="text-primary-foreground">
                Edit teaching profile
              </Typography>
            </Link>
            <Link
              href="/role"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 w-full rounded-xl"
              )}
            >
              <LogOut className="size-4" aria-hidden />
              <Typography variant="button">Switch role / sign out</Typography>
            </Link>
          </Card>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/teacher/verification">
                <Card className="h-full flex-row items-start gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift md:p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
                    <BadgeCheck className="size-5" aria-hidden />
                  </span>
                  <div>
                    <Typography variant="h3" className="text-sm tracking-tight md:text-base">
                      Verification center
                    </Typography>
                    <Typography variant="muted" className="text-sm">
                      Status: Verified · Manage ID documents
                    </Typography>
                  </div>
                </Card>
              </Link>
              <Link href="/teacher/profile/edit">
                <Card className="h-full flex-row items-start gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift md:p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
                    <IdCard className="size-5" aria-hidden />
                  </span>
                  <div>
                    <Typography variant="h3" className="text-sm tracking-tight md:text-base">
                      Teaching profile
                    </Typography>
                    <Typography variant="muted" className="text-sm">
                      {profile.board || "Add board"} · Edit subjects & fees
                    </Typography>
                  </div>
                </Card>
              </Link>
            </div>

            <Card className="gap-3 p-4 md:p-5">
              <SectionHeader title="Support & preferences" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/teacher/settings"
                  className="rounded-2xl bg-muted/40 p-3 transition hover:bg-muted/60"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-2xl bg-card text-primary shadow-soft">
                      <Settings2 className="size-4" aria-hidden />
                    </span>
                    <Typography variant="h3" className="text-sm tracking-tight">
                      Settings
                    </Typography>
                  </div>
                  <Typography variant="muted" className="text-sm">
                    Lead SMS, chat alerts, and privacy toggles.
                  </Typography>
                </Link>
                <Link
                  href="/teacher/help"
                  className="rounded-2xl bg-muted/40 p-3 transition hover:bg-muted/60"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-2xl bg-card text-primary shadow-soft">
                      <HelpCircle className="size-4" aria-hidden />
                    </span>
                    <Typography variant="h3" className="text-sm tracking-tight">
                      Help center
                    </Typography>
                  </div>
                  <Typography variant="muted" className="text-sm">
                    FAQs about leads, chat, and verification.
                  </Typography>
                </Link>
                <Link
                  href="/privacy"
                  className="rounded-2xl bg-muted/40 p-3 transition hover:bg-muted/60 sm:col-span-2"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-2xl bg-card text-primary shadow-soft">
                      <Shield className="size-4" aria-hidden />
                    </span>
                    <Typography variant="h3" className="text-sm tracking-tight">
                      Privacy policy
                    </Typography>
                  </div>
                  <Typography variant="muted" className="text-sm">
                    How Siksha handles teacher and parent data.
                  </Typography>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </PageMain>
    </>
  );
}
