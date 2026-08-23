"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toastApiError, useAuth } from "@/hooks/use-auth";
import { useAdminVerifications } from "@/hooks/use-admin-verifications";

function formatCreatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function AdminVerificationsPage() {
  const { logout } = useAuth();
  const {
    items,
    loading,
    error,
    openDocument,
    approve,
    reject,
    reviewingId,
  } = useAdminVerifications();

  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentLoadingId, setDocumentLoadingId] = useState<string | null>(
    null
  );

  async function handleViewId(id: string) {
    setDocumentLoadingId(id);
    try {
      const url = await openDocument(id);
      setDocumentUrl(url);
    } catch (err) {
      toastApiError(err, "Could not open ID document");
    } finally {
      setDocumentLoadingId(null);
    }
  }

  async function handleApprove(id: string) {
    try {
      await approve(id);
      toast.success("Approved");
      if (documentUrl) setDocumentUrl(null);
    } catch (err) {
      toastApiError(err, "Could not approve verification");
    }
  }

  async function handleReject(id: string) {
    const reason = window.prompt(
      "Optional rejection reason (max 500 characters)"
    );
    if (reason === null) return;
    const trimmed = reason.trim().slice(0, 500);
    try {
      await reject(id, trimmed || undefined);
      toast.success("Rejected");
      if (documentUrl) setDocumentUrl(null);
    } catch (err) {
      toastApiError(err, "Could not reject verification");
    }
  }

  return (
    <>
      <AppHeader
        title="Verification queue"
        showBrand={false}
        rightSlot={
          <Button type="button" variant="ghost" size="sm" onClick={() => logout()}>
            <Typography variant="button">Sign out</Typography>
          </Button>
        }
      />
      <PageMain>
        {loading ? (
          <Typography variant="muted">Loading…</Typography>
        ) : error ? (
          <Typography variant="muted">{error}</Typography>
        ) : items.length === 0 ? (
          <Typography variant="muted">No pending IDs</Typography>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => {
              const busy = reviewingId === item.id;
              const viewing = documentLoadingId === item.id;
              return (
                <Typography key={item.id} variant="li" className="list-none">
                  <Card className="gap-3 p-4">
                    <div className="space-y-1">
                      <Typography
                        variant="h3"
                        className="text-base tracking-tight">
                        {item.teacherName ?? "Teacher"}
                      </Typography>
                      <Typography
                        variant="bodyMedium"
                        className="text-muted-foreground">
                        {item.subjects.join(", ") || "No subjects"}
                      </Typography>
                      <Typography
                        variant="bodyMedium"
                        className="text-muted-foreground">
                        {item.classes.join(", ") || "No classes"}
                      </Typography>
                      <Typography variant="small">
                        {formatCreatedAt(item.createdAt)}
                      </Typography>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={viewing || busy}
                        onClick={() => void handleViewId(item.id)}>
                        <Typography variant="button">
                          {viewing ? "Opening…" : "View ID"}
                        </Typography>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={busy}
                        onClick={() => void handleApprove(item.id)}>
                        <Typography
                          variant="button"
                          className="text-primary-foreground">
                          Approve
                        </Typography>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={busy}
                        onClick={() => void handleReject(item.id)}>
                        <Typography variant="button">Reject</Typography>
                      </Button>
                    </div>
                  </Card>
                </Typography>
              );
            })}
          </ul>
        )}
      </PageMain>

      {documentUrl ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Teacher ID document">
          <Card className="max-h-[90dvh] w-full max-w-lg gap-3 overflow-auto p-4">
            <div className="flex items-center justify-between gap-2">
              <Typography variant="h3" className="text-base tracking-tight">
                Teacher ID
              </Typography>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDocumentUrl(null)}>
                <Typography variant="button">Close</Typography>
              </Button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- short-lived R2 URL */}
            <img
              src={documentUrl}
              alt="Teacher ID"
              className="max-h-[70dvh] w-full rounded-xl object-contain"
            />
          </Card>
        </div>
      ) : null}
    </>
  );
}
