import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Home,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/seo/site-footer";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Thank you | Siksha inquiry received",
  description:
    "Thanks for posting your home tuition requirement on Siksha. Verified teachers in Farrukhabad can now apply and chat with you in-app.",
  path: "/thank-you",
  noIndex: true,
});

const nextSteps = [
  {
    icon: Clock3,
    title: "Wait for applicants",
    detail: siteConfig.responseTimePromise,
  },
  {
    icon: MessageCircle,
    title: "Chat in-app",
    detail: "Compare fees and availability without sharing your phone number.",
  },
  {
    icon: ShieldCheck,
    title: "Hire with confidence",
    detail: "Prefer verified tutors and mark hired when you choose one.",
  },
] as const;

export default function ThankYouPage() {
  return (
    <div className="min-h-dvh bg-background md:bg-[radial-gradient(ellipse_at_top,_#e8f6f7_0%,_#fcf9f8_50%,_#f0eded_100%)]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Thank you", path: "/thank-you" },
        ])}
      />
      <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-5xl flex-col px-4 py-6 sm:py-8 md:px-8 md:py-12 lg:px-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Thank you" },
          ]}
          className="mb-6 md:mb-8"
        />

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:items-start lg:gap-8">
          <Card className="gap-5 p-5 text-center sm:p-7 md:p-8 lg:text-left">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-success text-success-foreground shadow-soft lg:mx-0 md:size-16">
              <CheckCircle2 className="size-7 md:size-8" aria-hidden />
            </span>
            <div className="space-y-3">
              <Typography variant="h1" className="text-3xl md:text-4xl">
                Thank you — inquiry received
              </Typography>
              <Typography variant="muted" className="mx-auto max-w-xl text-base lg:mx-0">
                Your tuition requirement is live for verified teachers in{" "}
                {siteConfig.city}. We will notify you when tutors apply.
              </Typography>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/parent/home"
                className={cn(buttonVariants(), "h-11 rounded-xl px-5 md:h-12")}
              >
                <Home className="size-4" aria-hidden />
                <Typography variant="button" className="text-primary-foreground">
                  Go to dashboard
                </Typography>
              </Link>
              <Link
                href="/parent/chat"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 rounded-xl px-5 md:h-12"
                )}
              >
                <MessageCircle className="size-4" aria-hidden />
                <Typography variant="button">Open messages</Typography>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 lg:justify-start">
              <Link href="/#faq" className="inline-flex">
                <Typography variant="link">Read FAQ</Typography>
              </Link>
              <Typography variant="small" className="text-muted-foreground">
                ·
              </Typography>
              <Link href="/privacy" className="inline-flex">
                <Typography variant="link">Privacy policy</Typography>
              </Link>
              <Typography variant="small" className="text-muted-foreground">
                ·
              </Typography>
              <Link href="/parent/browse" className="inline-flex">
                <Typography variant="link">Browse tutors</Typography>
              </Link>
            </div>
          </Card>

          <div className="space-y-3">
            <SectionHeader title="What happens next" />
            {nextSteps.map((step) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.title}
                  className="flex-row items-start gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift md:p-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-soft">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="space-y-1">
                    <Typography variant="h3" className="text-sm md:text-base">
                      {step.title}
                    </Typography>
                    <Typography variant="muted" className="text-sm">
                      {step.detail}
                    </Typography>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
