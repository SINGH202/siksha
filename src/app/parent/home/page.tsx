import Link from "next/link";
import { ArrowRight, Clock3, Plus, Search } from "lucide-react";

import { CompactTeacherCard } from "@/components/domain/compact-teacher-card";
import { RequirementCard } from "@/components/domain/requirement-card";
import { TrustBanner } from "@/components/domain/trust-banner";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { ResponseTimePromise } from "@/components/seo/response-time-promise";
import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { parentRequirements, teachers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ParentHomePage() {
  const recommended = teachers.filter((teacher) => teacher.verified);

  return (
    <>
      <AppHeader showMenu showNotifications title="Dashboard" hideDesktopTitle />
      <PageMain>
        <ResponseTimePromise className="md:max-w-xl" />

        <div className="space-y-1.5 md:hidden">
          <Typography variant="h2" className="tracking-tight">
            Namaste, Rahul
          </Typography>
          <Typography variant="muted">
            Find a trusted home tutor for Classes 8–12 in Farrukhabad.
          </Typography>
        </div>

        <Card className="hidden gap-0 overflow-hidden border-border/40 p-0 md:grid md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 p-8 lg:p-10">
            <Typography variant="h2" className="text-3xl tracking-tight">
              Find the perfect tutor for your child
            </Typography>
            <Typography variant="muted" className="max-w-lg text-base">
              Post your requirement and let verified home tutors in Farrukhabad
              reach out. Chat stays on Siksha.
            </Typography>
            <Link
              href="/parent/requirements/new"
              className={cn(buttonVariants({ size: "lg" }), "inline-flex px-5")}
            >
              <Plus className="size-4" />
              <Typography variant="button" className="text-primary-foreground">
                Post a requirement
              </Typography>
            </Link>
          </div>
          <div className="relative min-h-48 overflow-hidden bg-gradient-to-br from-accent via-secondary/50 to-warning/25 p-8">
            <div className="absolute -right-8 -top-8 size-40 rounded-full border border-primary/10 bg-card/30" />
            <div className="absolute bottom-6 left-6 size-24 rounded-full border border-primary/10 bg-card/20" />
            <div className="relative flex h-full flex-col justify-end gap-2">
              <Typography variant="h3" className="text-primary">
                Namaste, Rahul
              </Typography>
              <Typography variant="muted">
                Classes 8–12 · Home tuition
              </Typography>
            </div>
          </div>
        </Card>

        <Link href="/parent/requirements/new" className="block md:hidden">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-[#0d747d] p-5 text-primary-foreground shadow-lift ring-0">
            <div className="absolute -right-6 -top-6 size-28 rounded-full bg-white/10" />
            <div className="flex items-start gap-3 pr-10">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
                <Plus className="size-5" />
              </span>
              <div className="space-y-1">
                <Typography
                  variant="h3"
                  className="text-base text-primary-foreground"
                >
                  Post a requirement
                </Typography>
                <Typography
                  variant="muted"
                  className="text-sm text-primary-foreground/80"
                >
                  बताएं क्या चाहिए — tutors will apply
                </Typography>
              </div>
            </div>
            <span className="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full bg-white text-primary shadow-soft">
              <ArrowRight className="size-5" />
            </span>
          </Card>
        </Link>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <Link href="/parent/browse">
            <Card className="h-full gap-2 border-0 bg-[#f6ebe8] p-4 shadow-none ring-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft">
              <span className="flex size-9 items-center justify-center rounded-xl bg-card/80 text-primary">
                <Search className="size-4" />
              </span>
              <Typography variant="h3" className="text-sm tracking-tight">
                Browse tutors
              </Typography>
              <Typography variant="small">Verified teachers</Typography>
            </Card>
          </Link>
          <Link href="/parent/requirements">
            <Card className="h-full gap-2 border-0 bg-secondary/70 p-4 shadow-none ring-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft">
              <span className="flex size-9 items-center justify-center rounded-xl bg-card/80 text-secondary-foreground">
                <Clock3 className="size-4" />
              </span>
              <Typography variant="h3" className="text-sm tracking-tight">
                Your requests
              </Typography>
              <Typography variant="small">Track applicants</Typography>
            </Card>
          </Link>
          <Link href="/parent/chat" className="col-span-2 md:col-span-1">
            <Card className="h-full gap-2 border-0 bg-accent p-4 shadow-none ring-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft">
              <span className="flex size-9 items-center justify-center rounded-xl bg-card/80 text-accent-foreground">
                <ArrowRight className="size-4" />
              </span>
              <Typography variant="h3" className="text-sm tracking-tight">
                Messages
              </Typography>
              <Typography variant="small">Continue conversations</Typography>
            </Card>
          </Link>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)] lg:items-start">
          <section className="space-y-4">
            <SectionHeader
              title="Your active requirements"
              action={
                <Link
                  href="/parent/requirements"
                  className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
                >
                  <Typography variant="link">View all</Typography>
                </Link>
              }
            />
            <div className="space-y-3">
              {parentRequirements.map((requirement) => (
                <RequirementCard
                  key={requirement.id}
                  requirement={requirement}
                  href={`/parent/requirements/${requirement.id}`}
                />
              ))}
            </div>
            <div className="md:hidden">
              <TrustBanner />
            </div>
          </section>

          <aside className="hidden space-y-4 lg:block">
            <SectionHeader
              title="Recommended tutors"
              action={
                <Link
                  href="/parent/browse"
                  className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
                >
                  <Typography variant="link">Browse</Typography>
                </Link>
              }
            />
            <div className="space-y-3">
              {recommended.map((teacher) => (
                <CompactTeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  href={`/parent/teachers/${teacher.id}`}
                />
              ))}
            </div>
            <TrustBanner />
          </aside>
        </div>
      </PageMain>
    </>
  );
}
