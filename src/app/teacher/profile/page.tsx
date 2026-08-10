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
  Star,
} from "lucide-react";

import { VerifiedBadge } from "@/components/domain/status-badge";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { initialsFromName } from "@/hooks/use-account";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useTeacherReviews } from "@/hooks/use-teacher-reviews";
import { formatActivityTime } from "@/lib/api/mappers";
import { isTeacherProfileMe } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        return (
          <Star
            key={value}
            className={`size-4 ${
              value <= rating
                ? "fill-warning text-warning-foreground"
                : "text-muted-foreground/40"
            }`}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

export default function TeacherProfilePage() {
  const { data, loading } = useProfile();
  const { user, logout } = useAuth();
  const {
    items: reviews,
    loading: reviewsLoading,
    error: reviewsError,
  } = useTeacherReviews(user?.id);
  const profile =
    data && isTeacherProfileMe(data) ? data.profile : null;
  const ready = !loading;
  const displayName = profile?.name || "Teacher";
  const classes = profile?.classes ?? [];
  const subjects = profile?.subjects ?? [];
  const localities = profile?.localities ?? [];
  const coversAll = profile?.coversAllLocalities ?? false;
  const classesDisplay =
    classes.length > 0
      ? `Classes ${[...classes].sort((a, b) => Number(a) - Number(b)).join(", ")}`
      : "Classes not set";
  const areasDisplay = coversAll
    ? "All Farrukhabad localities"
    : localities.join(", ") || "Add areas";
  const verified = profile?.verificationStatus === "verified";

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
                  aria-label={`Profile photo placeholder for ${displayName}`}
                >
                  {ready ? initialsFromName(displayName) : "…"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  <Typography variant="h2" className="text-xl tracking-tight md:text-2xl">
                    {ready ? displayName : "Loading…"}
                  </Typography>
                  {verified ? <VerifiedBadge /> : null}
                </div>
                <Typography variant="muted">Teacher account</Typography>
              </div>
            </div>
            <div className="space-y-2 rounded-xl bg-muted/50 p-3 text-left">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0" aria-hidden />
                <Typography variant="bodySmall">{areasDisplay}</Typography>
              </div>
              <Typography variant="bodySmall" className="font-medium">
                {subjects.join(", ") || "Add subjects"} · {classesDisplay}
              </Typography>
              <Typography variant="small">
                {profile?.feeMin != null && profile?.feeMax != null
                  ? `₹${profile.feeMin}–${profile.feeMax} / hour`
                  : "Add fee range"}
              </Typography>
              {profile?.bio ? (
                <Typography variant="muted" className="text-sm">
                  {profile.bio}
                </Typography>
              ) : null}
              {data && isTeacherProfileMe(data) && !data.isComplete ? (
                <Typography variant="small" className="text-amber-700">
                  Finish your profile to unlock better lead matching.
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
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl"
              onClick={() => logout()}
            >
              <LogOut className="size-4" aria-hidden />
              <Typography variant="button">Sign out</Typography>
            </Button>
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
                      Status:{" "}
                      {profile?.verificationStatus
                        ? profile.verificationStatus.charAt(0).toUpperCase() +
                          profile.verificationStatus.slice(1)
                        : "Unverified"}{" "}
                      · Manage ID documents
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
                      Edit subjects, areas & fees
                    </Typography>
                  </div>
                </Card>
              </Link>
            </div>

            <Card className="gap-3 p-4 md:p-5">
              <SectionHeader title="Parent reviews" />
              {reviewsLoading ? (
                <Typography variant="muted" className="text-sm">
                  Loading reviews…
                </Typography>
              ) : reviewsError ? (
                <Typography variant="small" className="text-destructive">
                  {reviewsError}
                </Typography>
              ) : reviews.length === 0 ? (
                <Typography variant="muted" className="text-sm">
                  No reviews yet
                </Typography>
              ) : (
                <ul className="space-y-3">
                  {reviews.map((review) => (
                    <li
                      key={review.id}
                      className="space-y-2 rounded-2xl bg-muted/40 p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Typography variant="h3" className="text-sm tracking-tight">
                          {review.parentName?.trim() || "Parent"}
                        </Typography>
                        <Typography variant="small" className="text-muted-foreground">
                          {formatActivityTime(review.createdAt)}
                        </Typography>
                      </div>
                      <ReviewStars rating={review.rating} />
                      {review.body ? (
                        <Typography variant="bodySmall">{review.body}</Typography>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </Card>

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
