"use client";

import Link from "next/link";
import { toast } from "sonner";

import { SettingsToggle } from "@/components/domain/settings-toggle";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTeacherSettings } from "@/hooks/use-account";
import { cn } from "@/lib/utils";

export default function TeacherSettingsPage() {
  const { value: settings, save, ready } = useTeacherSettings();

  function update<K extends keyof typeof settings>(
    key: K,
    next: (typeof settings)[K]
  ) {
    save({ ...settings, [key]: next });
    toast.success("Settings saved");
  }

  return (
    <>
      <AppHeader
        title="Settings"
        showBrand={false}
        backHref="/teacher/profile"
        narrow
        subtitle="Control lead alerts, chat notifications, and privacy."
      />
      <PageMain narrow className="gap-4">
        {!ready ? (
          <Typography variant="muted">Loading settings...</Typography>
        ) : (
          <div className="space-y-3">
            <SettingsToggle
              label="New lead SMS"
              description="Get SMS when a matching requirement is posted near you."
              checked={settings.smsAlerts}
              onCheckedChange={(checked) => update("smsAlerts", checked)}
            />
            <SettingsToggle
              label="Chat alerts"
              description="Notify me when parents reply in chat."
              checked={settings.chatAlerts}
              onCheckedChange={(checked) => update("chatAlerts", checked)}
            />
            <SettingsToggle
              label="Hide phone on profile"
              description="Parents contact you through Siksha chat first."
              checked={settings.hidePhoneOnProfile}
              onCheckedChange={(checked) => update("hidePhoneOnProfile", checked)}
            />
            <SettingsToggle
              label="Product tips"
              description="Occasional tips to improve lead conversion."
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => update("marketingEmails", checked)}
            />

            <Card className="gap-3 border-border/50 p-4">
              <Typography variant="h3" className="text-sm tracking-tight">
                Language
              </Typography>
              <div className="flex gap-2">
                {(["en", "hi"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => update("language", lang)}
                    className={cn(
                      "inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition-all duration-200",
                      settings.language === lang
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-card ring-1 ring-border/70 hover:bg-muted/70"
                    )}
                  >
                    <Typography
                      variant="button"
                      className={
                        settings.language === lang
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }
                    >
                      {lang === "en" ? "English" : "हिन्दी"}
                    </Typography>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
          <Link
            href="/teacher/profile/edit"
            className={cn(buttonVariants(), "h-11")}
          >
            <Typography variant="button" className="text-primary-foreground">
              Edit teaching profile
            </Typography>
          </Link>
          <Link
            href="/teacher/help"
            className={cn(buttonVariants({ variant: "outline" }), "h-11")}
          >
            <Typography variant="button">Open help center</Typography>
          </Link>
        </div>
      </PageMain>
    </>
  );
}
