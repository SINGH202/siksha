import type { Metadata } from "next";
import { GraduationCap, Lock, Users } from "lucide-react";

import { RoleCard } from "@/components/domain/role-card";
import { AppShell } from "@/components/layout/app-shell";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Typography } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Choose parent or teacher | Get started",
  description:
    "Join Siksha as a parent looking for Class 8–12 home tutors in Farrukhabad, or as a verified teacher seeking local leads.",
  path: "/role",
});

export default function RolePage() {
  return (
    <AppShell variant="auth">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Get started", path: "/role" },
        ])}
      />
      <Card className="relative hidden w-full max-w-md flex-col justify-between overflow-hidden border-0 bg-gradient-to-br from-primary to-[#0d747d] p-10 text-primary-foreground shadow-lift ring-0 md:flex md:rounded-3xl">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
        <div className="absolute bottom-16 -left-8 size-28 rounded-full bg-white/5" />
        <div className="relative space-y-3">
          <Typography variant="h1" className="text-primary-foreground">
            Siksha
          </Typography>
          <Typography
            variant="bodyMedium"
            className="text-primary-foreground/85"
          >
            Local home tuition marketplace for Farrukhabad — built mobile-first,
            comfortable on desktop too.
          </Typography>
        </div>
        <Typography variant="small" className="relative text-primary-foreground/70">
          Classes 8–12 · Verified teachers · In-app chat
        </Typography>
      </Card>

      <div className="flex flex-1 flex-col justify-between px-5 py-10 md:justify-center md:px-4 md:py-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Get started" },
          ]}
          className="mb-6 justify-center md:justify-start"
        />
        <div className="flex flex-1 flex-col justify-center gap-8 md:flex-none">
          <div className="space-y-2 text-center md:text-left">
            <Typography variant="h1" className="tracking-tight md:hidden">
              Siksha
            </Typography>
            <Typography variant="h2" className="hidden tracking-tight md:block">
              Welcome
            </Typography>
            <Typography variant="muted">
              Welcome to your local tutoring marketplace in Farrukhabad.
            </Typography>
          </div>

          <div className="mx-auto w-full max-w-md space-y-3 md:mx-0">
            <RoleCard
              href="/login?role=parent"
              icon={Users}
              title="I am a Parent / मैं अभिभावक हूँ"
              description="Find verified home tutors for Classes 8–12 near you."
            />
            <RoleCard
              href="/login?role=teacher"
              icon={GraduationCap}
              title="I am a Teacher / मैं शिक्षक हूँ"
              description="Get serious local leads and chat with parents on Siksha."
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pb-2 text-muted-foreground md:justify-start md:pt-8">
          <Lock className="size-3.5" />
          <Typography variant="small">
            Secure and trusted local network
          </Typography>
        </div>
      </div>
    </AppShell>
  );
}
