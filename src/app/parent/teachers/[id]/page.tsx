import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { VerifiedBadge } from "@/components/domain/status-badge";
import { StickyCta } from "@/components/domain/sticky-cta";
import { TrustBanner } from "@/components/domain/trust-banner";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { teachers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

function SendRequestButton({ className }: { className?: string }) {
  return (
    <Link
      href="/parent/requirements/new"
      className={cn(buttonVariants(), "h-12 w-full", className)}>
      <Typography variant="button" className="text-primary-foreground">
        Send request
      </Typography>
    </Link>
  );
}

export default async function TeacherProfilePage({ params }: PageProps) {
  const { id } = await params;
  const teacher = teachers.find((item) => item.id === id) ?? teachers[0];
  if (!teacher) notFound();

  return (
    <>
      <AppHeader
        title="Tutor profile"
        showBrand={false}
        backHref="/parent/browse"
      />
      <PageMain>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] lg:items-start">
          <div className="space-y-5">
            <Card className="items-center gap-3 p-5 text-center md:items-start md:p-8 md:text-left">
              <Avatar className="size-20">
                <AvatarFallback className="bg-accent text-lg text-accent-foreground">
                  {teacher.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <Typography
                    variant="h2"
                    className="text-xl tracking-tight md:text-2xl">
                    {teacher.name}
                  </Typography>
                  {teacher.verified ? <VerifiedBadge /> : null}
                </div>
                {teacher.rating ? (
                  <div className="flex items-center justify-center gap-1 text-warning-foreground md:justify-start">
                    <Star className="size-4 fill-current" />
                    <Typography variant="bodySmall" className="font-semibold">
                      {teacher.rating} · {teacher.reviewCount} reviews
                    </Typography>
                  </div>
                ) : null}
                <Typography variant="muted">{teacher.bio}</Typography>
              </div>
            </Card>

            <Card className="gap-3 p-4 md:p-5">
              <Typography variant="label">Subjects</Typography>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="secondary"
                    className="h-7 bg-accent">
                    <Typography
                      variant="small"
                      className="text-accent-foreground">
                      {subject}
                    </Typography>
                  </Badge>
                ))}
              </div>
              <Typography variant="bodySmall" className="font-medium">
                {teacher.classes}
                {teacher.board ? ` · ${teacher.board}` : ""}
              </Typography>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 size-4" />
                <Typography variant="muted">
                  {teacher.areas.join(", ")}
                </Typography>
              </div>
            </Card>

            <TrustBanner
              title="Chat stays on Siksha"
              description="Phone numbers are not shown on profiles. Connect through in-app chat."
            />
          </div>

          <aside className="hidden lg:block">
            <Card className="sticky top-24 gap-4 p-5">
              <div className="space-y-1">
                <Typography variant="label">Hourly fee</Typography>
                <Typography
                  variant="h3"
                  className="text-xl tracking-tight text-primary">
                  ₹{teacher.feeMin} – ₹{teacher.feeMax}
                </Typography>
                <Typography variant="muted">
                  Post a requirement to start a private chat.
                </Typography>
              </div>
              <SendRequestButton />
              <Typography variant="small">
                No phone numbers shared until you both agree.
              </Typography>
            </Card>
          </aside>
        </div>
      </PageMain>

      <StickyCta mobileOnly>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Typography variant="small">From</Typography>
            <Typography variant="bodySmall" className="font-semibold">
              ₹{teacher.feeMin} / hour
            </Typography>
          </div>
          <SendRequestButton className="w-auto min-w-40 px-5" />
        </div>
      </StickyCta>
    </>
  );
}
