"use client";

import Link from "next/link";
import {
  Bell,
  HelpCircle,
  LogOut,
  MapPin,
  Pencil,
  Settings2,
  Shield,
  UserRound,
} from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { initialsFromName } from "@/hooks/use-account";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { isParentProfileMe } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export default function ParentProfilePage() {
  const { data, loading } = useProfile();
  const { user, logout } = useAuth();
  const profile = data && isParentProfileMe(data) ? data.profile : null;
  const ready = !loading;
  const displayName = profile?.name || "Parent";
  const locality = profile?.locality || "Add locality";
  const phone = user?.phone?.replace(/^\+91/, "") ?? "—";

  const quickLinks = [
    {
      href: "/parent/settings",
      title: "Settings",
      detail: "Alerts, privacy, language",
      icon: Settings2,
    },
    {
      href: "/parent/help",
      title: "Help center",
      detail: "FAQs and support for parents",
      icon: HelpCircle,
    },
    {
      href: "/parent/requirements",
      title: "My requirements",
      detail: "Track applicants and status",
      icon: UserRound,
    },
  ] as const;

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
                  aria-label={`Profile photo placeholder for ${displayName}`}>
                  {ready ? initialsFromName(displayName) : "…"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                {ready ? (
                  <Typography
                    variant="h2"
                    className="text-xl tracking-tight md:text-2xl">
                    {displayName}
                  </Typography>
                ) : (
                  <Skeleton className="mx-auto h-8 w-40 lg:mx-0" />
                )}
                <Typography variant="muted">Parent account</Typography>
              </div>
            </div>
            <div className="space-y-2 rounded-xl bg-muted/50 p-3 text-left">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0" aria-hidden />
                <Typography variant="bodySmall">
                  Farrukhabad · {locality}
                </Typography>
              </div>
              <Typography variant="bodySmall" className="font-medium">
                +91 {phone}
              </Typography>
              {data && isParentProfileMe(data) && !data.isComplete ? (
                <Typography variant="small" className="text-amber-700">
                  Finish your profile so tutors can match you better.
                </Typography>
              ) : null}
            </div>
            <Link
              href="/parent/profile/edit"
              className={cn(buttonVariants(), "h-11 w-full rounded-xl")}>
              <Pencil className="size-4" aria-hidden />
              <Typography variant="button" className="text-primary-foreground">
                Edit details
              </Typography>
            </Link>
            <Button
              type="button"
              variant="ghost"
              className="h-11 w-full"
              onClick={() => logout()}>
              <LogOut className="size-4" aria-hidden />
              <Typography variant="button">Sign out</Typography>
            </Button>
          </Card>

          <div className="space-y-4">
            <Card className="gap-3 p-4 md:p-5">
              <SectionHeader title="Account preferences" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/parent/settings"
                  className="rounded-2xl bg-muted/40 p-3 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/60 hover:shadow-lift">
                  <div className="mb-1 flex items-center gap-2">
                    <Bell className="size-4 text-primary" aria-hidden />
                    <Typography variant="h3" className="text-sm">
                      Notifications
                    </Typography>
                  </div>
                  <Typography variant="muted" className="text-sm">
                    Manage SMS and chat alerts in Settings.
                  </Typography>
                </Link>
                <Link
                  href="/privacy"
                  className="rounded-2xl bg-muted/40 p-3 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/60 hover:shadow-lift">
                  <div className="mb-1 flex items-center gap-2">
                    <Shield className="size-4 text-primary" aria-hidden />
                    <Typography variant="h3" className="text-sm">
                      Privacy
                    </Typography>
                  </div>
                  <Typography variant="muted" className="text-sm">
                    Phone number hidden on public profiles during matching.
                  </Typography>
                </Link>
              </div>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <Card className="h-full flex-row items-start gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-soft">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div>
                        <Typography variant="h3" className="text-sm">
                          {link.title}
                        </Typography>
                        <Typography variant="muted" className="text-sm">
                          {link.detail}
                        </Typography>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </PageMain>
    </>
  );
}
