import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { AboveFoldReactions } from "@/components/seo/above-fold-reactions";
import { CaseStudySection } from "@/components/seo/case-study-section";
import { FaqSection } from "@/components/seo/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { MapsDirections } from "@/components/seo/maps-directions";
import { ResponseTimePromise } from "@/components/seo/response-time-promise";
import { ReviewsSection } from "@/components/seo/reviews-section";
import { SiteFooter } from "@/components/seo/site-footer";
import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { faqPageJsonLd, localBusinessJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { marketingFaqs, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Siksha | Home tuition in Farrukhabad for Classes 8–12",
  description: siteConfig.description,
  path: "/",
});

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-background pb-24 md:pb-0">
      <JsonLd data={localBusinessJsonLd()} />
      <JsonLd data={faqPageJsonLd(marketingFaqs)} />

      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-8 lg:px-10">
          <Typography variant="h3" className="tracking-tight text-primary">
            Siksha
          </Typography>
          <nav className="hidden items-center gap-4 md:flex" aria-label="Primary">
            <Link href="/#reviews" className="text-sm font-medium text-primary hover:underline">
              Reviews
            </Link>
            <Link href="/#faq" className="text-sm font-medium text-primary hover:underline">
              FAQ
            </Link>
            <Link href="/#location" className="text-sm font-medium text-primary hover:underline">
              Location
            </Link>
            <Link href="/privacy" className="text-sm font-medium text-primary hover:underline">
              Privacy
            </Link>
            <Link
              href="/role"
              className={cn(buttonVariants({ size: "sm" }), "rounded-full px-3")}
            >
              <Typography variant="button" className="text-primary-foreground">
                Get started
              </Typography>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-5">
              <Typography variant="h1" className="text-4xl tracking-tight md:text-5xl">
                Home tutors in {siteConfig.city}, matched with care
              </Typography>
              <Typography variant="muted" className="max-w-xl text-base md:text-lg">
                Post a Class 8–12 requirement, review verified teachers, and chat
                in-app. Built for parents who want safe, local home tuition.
              </Typography>

              <AboveFoldReactions />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login?role=parent"
                  className={cn(buttonVariants(), "h-12 rounded-xl px-5")}
                >
                  <Typography variant="button" className="text-primary-foreground">
                    I am a parent
                  </Typography>
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href="/login?role=teacher"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-12 rounded-xl px-5"
                  )}
                >
                  <Typography variant="button">I am a teacher</Typography>
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <Link href="/#case-study" className="text-sm font-medium text-primary hover:underline">
                  Read a local case study
                </Link>
                <Link href="/#faq" className="text-sm font-medium text-primary hover:underline">
                  Browse FAQs
                </Link>
                <Link href="/privacy" className="text-sm font-medium text-primary hover:underline">
                  Privacy policy
                </Link>
              </div>
            </div>

            <Card className="relative gap-4 overflow-hidden border-0 bg-gradient-to-br from-primary to-[#0d747d] p-6 text-primary-foreground shadow-lift ring-0 md:p-8">
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" />
              <span className="relative flex size-12 items-center justify-center rounded-2xl bg-white/15">
                <ShieldCheck className="size-6" aria-hidden />
              </span>
              <Typography variant="h2" className="relative text-2xl tracking-tight text-primary-foreground">
                Verified teachers. In-app chat. Local focus.
              </Typography>
              <Typography
                variant="bodyMedium"
                className="text-primary-foreground/85"
              >
                {siteConfig.responseTimePromise}. No phone numbers on public
                profiles during matching.
              </Typography>
              <Link
                href="/role"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 font-semibold text-primary"
              >
                <Typography variant="button" className="text-primary">
                  Start free matching
                </Typography>
              </Link>
            </Card>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-12 px-4 pb-14 md:px-8 lg:px-10">
          <ResponseTimePromise />
          <ReviewsSection />
          <CaseStudySection />
          <FaqSection items={marketingFaqs} />
          <MapsDirections />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
