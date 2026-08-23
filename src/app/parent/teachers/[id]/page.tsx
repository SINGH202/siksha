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

export default async function TeacherProfilePage({ params }: PageProps) {
  const { id } = await params;
  const teacher = teachers.find((item) => item.id === id) ?? teachers[0];
  if (!teacher) notFound();

  return (
    <>
      <AppHeader
        narrow
        title="Tutor profile"
        showBrand={false}
        backHref="/parent/browse"
      />
      <PageMain narrow>
        <Card className="items-center gap-3 p-5 text-center md:p-8">
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
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Typography
                variant="h2"
                className="text-xl tracking-tight md:text-2xl">
                {teacher.name}
              </Typography>
              {teacher.verified ? <VerifiedBadge /> : null}
            </div>
            {teacher.rating ? (
              <div className="flex items-center justify-center gap-1 text-warning-foreground">
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
                <Typography variant="small" className="text-accent-foreground">
                  {subject}
                </Typography>
              </Badge>
            ))}
          </div>
          <Typography variant="bodySmall" className="font-medium">
            {teacher.classes}
            {teacher.board ? ` · ${teacher.board}` : ""}
          </Typography>
          <Typography variant="bodySmall" className="font-medium">
            ₹{teacher.feeMin} – ₹{teacher.feeMax} / hour
          </Typography>
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="mt-0.5 size-4" />
            <Typography variant="muted">{teacher.areas.join(", ")}</Typography>
          </div>
        </Card>

        <TrustBanner
          title="Chat stays on Siksha"
          description="Phone numbers are not shown on profiles. Connect through in-app chat."
        />
      </PageMain>

      <StickyCta narrow>
        <Link
          href="/parent/requirements/new"
          className={cn(buttonVariants(), "h-12 w-full rounded-xl")}>
          <Typography variant="button" className="text-primary-foreground">
            Send request
          </Typography>
        </Link>
      </StickyCta>
    </>
  );
}
