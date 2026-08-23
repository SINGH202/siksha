"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Clock3, Upload } from "lucide-react";
import { toast } from "sonner";

import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toastApiError, useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useVerificationMe } from "@/hooks/use-verification-me";
import type { VerificationStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function statusLabel(status: VerificationStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
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
      return "Re-upload ID (optional)";
    case "unverified":
      return "Upload government ID";
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
    } catch (err) {
      toastApiError(err, "Could not submit ID");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <AppHeader
        narrow
        title="Verification"
        showBrand={false}
        backHref="/teacher/profile"
      />
      <PageMain narrow>
        <Card className="gap-3 p-4 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <Typography
              variant="h3"
              className="text-base tracking-tight md:text-lg">
              Teacher verification
            </Typography>
            {loading && !data ? (
              <Badge
                variant="outline"
                className="h-6 border-border bg-muted/50 text-muted-foreground">
                <Typography variant="small" className="text-muted-foreground">
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
            Only verified teachers can apply to parent requirements.
          </Typography>
          {error ? (
            <Typography variant="small" className="text-destructive">
              {error}
            </Typography>
          ) : null}
        </Card>

        <section className="space-y-3">
          <SectionHeader title="Verification steps" />
          {steps.map((step) => (
            <Card key={step.title} className="flex-row items-start gap-3 p-4">
              {step.done ? (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
                  <CheckCircle2 className="size-5" />
                </span>
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-soft">
                  <Clock3 className="size-5" />
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
        <Card
          role="button"
          tabIndex={submitting ? -1 : 0}
          aria-disabled={submitting}
          className={cn(
            "items-center gap-2 border-dashed border-border/80 p-6 text-center shadow-soft transition-colors hover:bg-muted/30",
            submitting && "pointer-events-none opacity-70"
          )}
          onClick={() => {
            if (!submitting) fileInputRef.current?.click();
          }}
          onKeyDown={(event) => {
            if (submitting) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}>
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
            <Upload className="size-6" />
          </span>
          <Typography variant="h3" className="text-sm tracking-tight">
            {uploadTitle(verificationStatus)}
          </Typography>
          <Typography variant="muted">
            JPEG, PNG, or WebP · max 2MB · review within 24–48 hours
          </Typography>
          {selectedFileName ? (
            <Typography variant="small">{selectedFileName}</Typography>
          ) : null}
          {submitting ? (
            <Typography variant="small">Uploading…</Typography>
          ) : null}
        </Card>
      </PageMain>
    </>
  );
}
