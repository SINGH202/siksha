"use client";

import { useRef, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  IdCard,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { TrustBanner } from "@/components/domain/trust-banner";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toastApiError, useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useVerificationMe } from "@/hooks/use-verification-me";
import type { VerificationStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function statusLabel(status: VerificationStatus): string {
  switch (status) {
    case "verified":
      return "Verified";
    case "pending":
      return "Under review";
    case "rejected":
      return "Rejected";
    case "unverified":
      return "Unverified";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function badgeClassName(status: VerificationStatus): string {
  switch (status) {
    case "verified":
      return "bg-success text-success-foreground";
    case "pending":
      return "bg-warning/25 text-warning-foreground border-warning/30";
    case "rejected":
      return "bg-destructive/10 text-destructive";
    case "unverified":
      return "border-border bg-muted/50 text-muted-foreground";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function idStepDetail(status: VerificationStatus): string {
  switch (status) {
    case "verified":
      return "Government ID approved";
    case "pending":
      return "Under review";
    case "rejected":
      return "Rejected — upload a new ID";
    case "unverified":
      return "Upload a government ID";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function uploadTitle(status: VerificationStatus): string {
  switch (status) {
    case "verified":
      return "Re-upload ID (optional)";
    case "rejected":
      return "Upload a new ID";
    case "pending":
      return "Replace submitted ID";
    case "unverified":
      return "Upload government ID";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function uploadButtonLabel(status: VerificationStatus): string {
  switch (status) {
    case "verified":
      return "Choose a new image";
    case "rejected":
      return "Choose a new image";
    case "pending":
      return "Replace image";
    case "unverified":
      return "Choose image";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function statusCopy(status: VerificationStatus): string {
  switch (status) {
    case "verified":
      return "You can apply to matching parent requirements.";
    case "pending":
      return "We usually review IDs within 24–48 hours.";
    case "rejected":
      return "Upload a clearer government ID to try again.";
    case "unverified":
      return "Verified teachers can apply to parent requirements.";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export default function VerificationPage() {
  const { isAuthenticated } = useAuth();
  const { isComplete } = useProfile();
  const { data, loading, error, submitId, submitting } = useVerificationMe();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const verificationStatus: VerificationStatus =
    data?.verificationStatus ?? "unverified";

  const steps = [
    {
      title: "Phone verified",
      detail: isAuthenticated ? "OTP confirmed" : "Sign in with OTP",
      done: isAuthenticated,
    },
    {
      title: "Profile completed",
      detail: isComplete
        ? "Subjects, areas, and fees added"
        : "Add subjects, areas, and fees",
      done: isComplete,
    },
    {
      title: "ID submitted",
      detail: idStepDetail(verificationStatus),
      done: verificationStatus === "verified",
    },
  ];

  async function handleFileChange(file: File | undefined) {
    if (!file) return;
    setSelectedFileName(file.name);
    try {
      await submitId(file);
      toast.success("ID submitted for review");
      setSelectedFileName(null);
    } catch (err) {
      toastApiError(err, "Could not submit ID");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function openPicker() {
    if (!submitting) fileInputRef.current?.click();
  }

  return (
    <>
      <AppHeader
        narrow
        title="Verification"
        subtitle="ID check for applying to leads"
        showBrand={false}
        backHref="/teacher/profile"
      />
      <PageMain narrow>
        <Card className="gap-4 overflow-hidden border-border/50 p-4 md:p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
              <BadgeCheck className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Typography
                  variant="h3"
                  className="text-base tracking-tight md:text-lg">
                  Teacher verification
                </Typography>
                {loading && !data ? (
                  <Badge
                    variant="outline"
                    className="h-6 border-border bg-muted/50 text-muted-foreground">
                    <Typography
                      variant="small"
                      className="text-muted-foreground">
                      Loading…
                    </Typography>
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className={cn("h-6", badgeClassName(verificationStatus))}>
                    <Typography variant="small" className="text-inherit">
                      {statusLabel(verificationStatus)}
                    </Typography>
                  </Badge>
                )}
              </div>
              <Typography variant="muted">
                {statusCopy(verificationStatus)}
              </Typography>
            </div>
          </div>
          {error ? (
            <Typography variant="small" className="text-destructive">
              {error}
            </Typography>
          ) : null}
        </Card>

        {verificationStatus === "rejected" ? (
          <TrustBanner
            title="This ID was not approved"
            description="Use a clear JPEG, PNG, or WebP of a government ID. Max 2MB."
          />
        ) : null}

        <section className="space-y-3">
          <SectionHeader
            title="Verification steps"
            description="Complete these once to apply for leads."
          />
          {steps.map((step) => (
            <Card
              key={step.title}
              className="flex-row items-start gap-3 border-border/50 p-4">
              {step.done ? (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
                  <CheckCircle2 className="size-5" aria-hidden />
                </span>
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-soft">
                  <Clock3 className="size-5" aria-hidden />
                </span>
              )}
              <div>
                <Typography variant="h3" className="text-sm tracking-tight">
                  {step.title}
                </Typography>
                <Typography variant="muted">{step.detail}</Typography>
              </div>
            </Card>
          ))}
        </section>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={submitting}
          onChange={(event) => {
            void handleFileChange(event.target.files?.[0]);
          }}
        />
        <Card className="items-center gap-3 border-dashed border-border/80 p-6 text-center shadow-soft">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
            {submitting ? (
              <IdCard className="size-6 animate-pulse" aria-hidden />
            ) : (
              <Upload className="size-6" aria-hidden />
            )}
          </span>
          <div className="space-y-1">
            <Typography variant="h3" className="text-sm tracking-tight">
              {uploadTitle(verificationStatus)}
            </Typography>
            <Typography variant="muted">
              JPEG, PNG, or WebP · max 2MB · review within 24–48 hours
            </Typography>
          </div>
          {selectedFileName ? (
            <Typography variant="small">{selectedFileName}</Typography>
          ) : null}
          {submitting ? (
            <Typography variant="small">Uploading…</Typography>
          ) : null}
          <Button
            type="button"
            className="h-11 px-5"
            disabled={submitting}
            aria-label={uploadTitle(verificationStatus)}
            onClick={openPicker}>
            <Upload className="size-4" aria-hidden />
            <Typography variant="button" className="text-primary-foreground">
              {submitting ? "Uploading…" : uploadButtonLabel(verificationStatus)}
            </Typography>
          </Button>
        </Card>
      </PageMain>
    </>
  );
}
