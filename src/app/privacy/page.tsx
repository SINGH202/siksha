import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/seo/site-footer";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy policy | Siksha Farrukhabad",
  description:
    "Learn how Siksha collects, uses, and protects parent and teacher information for the Farrukhabad home tuition marketplace.",
  path: "/privacy",
});

const sections = [
  {
    title: "Information we collect",
    body: "We collect phone numbers for OTP login, profile details (name, subjects, localities, fees), requirement content, chat messages, verification documents for teachers, and basic device/usage data to keep the service reliable.",
  },
  {
    title: "How we use information",
    body: "We use your data to match parents and teachers, send OTP and lead alerts, operate in-app chat, verify teachers, improve product quality, and comply with legal obligations.",
  },
  {
    title: "Sharing",
    body: "We do not sell personal data. Profiles and requirements are shared within the platform for matching. SMS and hosting providers may process data as service vendors under contract.",
  },
  {
    title: "Chat and phone numbers",
    body: "Phone numbers are not shown on public profiles during MVP matching. Users may voluntarily share contact details in chat. Prefer keeping conversations on Siksha until you trust the match.",
  },
  {
    title: "Data retention & security",
    body: "We retain account and matching records while your account is active and as needed for safety/disputes. We use access controls and encryption in transit. No method of transmission is 100% secure.",
  },
  {
    title: "Your choices",
    body: `Request account deletion or data corrections by emailing ${siteConfig.email}. You may stop using the service at any time. Analytics (when enabled) can be limited via browser controls.`,
  },
  {
    title: "Children",
    body: "Siksha accounts are for parents and teachers. Student details should be shared only as needed for tutoring arrangements by a parent/guardian.",
  },
  {
    title: "Contact",
    body: `Questions about privacy: ${siteConfig.email} · ${siteConfig.phoneDisplay} · ${siteConfig.address.street}, ${siteConfig.city}, ${siteConfig.state}.`,
  },
] as const;

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-background md:bg-[radial-gradient(ellipse_at_top,_#e8f6f7_0%,_#fcf9f8_50%,_#f0eded_100%)]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy policy", path: "/privacy" },
        ])}
      />
      <article className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy policy" },
          ]}
          className="mb-6 md:mb-8"
        />

        <Card className="mb-8 gap-3 p-6 md:p-8">
          <Typography variant="h1" className="text-3xl md:text-4xl">
            Privacy policy
          </Typography>
          <Typography variant="muted" className="max-w-2xl text-base">
            Last updated: 10 August 2026. This policy explains how {siteConfig.name}{" "}
            handles information for the {siteConfig.city} home tuition marketplace.
          </Typography>
        </Card>

        <div className="space-y-6">
          <SectionHeader
            title="Policy details"
            description="How Siksha collects, uses, and protects your information."
          />
          <div className="space-y-4">
            {sections.map((section) => (
              <Card key={section.title} className="gap-2 p-5 md:p-6">
                <Typography variant="h2" className="text-xl">
                  {section.title}
                </Typography>
                <Typography variant="bodyMedium" className="leading-relaxed text-muted-foreground">
                  {section.body}
                </Typography>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href="/" className="inline-flex">
            <Typography variant="link">Back to home</Typography>
          </Link>
          <Typography variant="small" className="text-muted-foreground">
            ·
          </Typography>
          <Link href="/role" className="inline-flex">
            <Typography variant="link">Get started</Typography>
          </Link>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
