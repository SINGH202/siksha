"use client";

import { useState } from "react";
import { Clock3, IdCard, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/domain/empty-state";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { initialsFromName } from "@/hooks/use-account";
import { toastApiError, useAuth } from "@/hooks/use-auth";
import { useAdminVerifications } from "@/hooks/use-admin-verifications";
import { formatActivityTime } from "@/lib/api/mappers";
import type { VerificationQueueItem } from "@/lib/api/types";

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

  const [reviewItem, setReviewItem] = useState<VerificationQueueItem | null>(
    null
  );
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentLoadingId, setDocumentLoadingId] = useState<string | null>(
    null
  );
  const [rejectItem, setRejectItem] = useState<VerificationQueueItem | null>(
    null
  );
  const [rejectReason, setRejectReason] = useState("");

  function closeDocument() {
    setReviewItem(null);
    setDocumentUrl(null);
  }

  async function handleViewId(item: VerificationQueueItem) {
    setDocumentLoadingId(item.id);
    try {
      const url = await openDocument(item.id);
      setReviewItem(item);
      setDocumentUrl(url);
    } catch (err) {
      toastApiError(err, "Could not open ID document");
    } finally {
      setDocumentLoadingId(null);
    }
  }

  async function handleApprove(item: VerificationQueueItem) {
    try {
      await approve(item.id);
      toast.success(`${item.teacherName ?? "Teacher"} approved`);
      if (reviewItem?.id === item.id) closeDocument();
    } catch (err) {
      toastApiError(err, "Could not approve verification");
    }
  }

  async function handleRejectConfirm() {
    if (!rejectItem) return;
    const trimmed = rejectReason.trim().slice(0, 500);
    try {
      await reject(rejectItem.id, trimmed || undefined);
      toast.success(`${rejectItem.teacherName ?? "Teacher"} rejected`);
      if (reviewItem?.id === rejectItem.id) closeDocument();
      setRejectItem(null);
      setRejectReason("");
    } catch (err) {
      toastApiError(err, "Could not reject verification");
    }
  }

  return (
    <>
      <AppHeader
        title="Verification queue"
        subtitle="Review pending teacher IDs"
        showBrand={false}
        rightSlot={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => logout()}>
            <LogOut className="size-4" aria-hidden />
            <Typography variant="button">Sign out</Typography>
          </Button>
        }
      />
      <PageMain>
        <Card className="hidden gap-0 overflow-hidden border-border/40 p-0 md:block">
          <div className="flex items-center gap-4 p-6 lg:p-8">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
              <ShieldCheck className="size-6" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <Typography variant="h2" className="text-2xl tracking-tight">
                Teacher ID review
              </Typography>
              <Typography variant="muted" className="max-w-xl">
                Open the government ID, then approve or reject. Phone numbers
                stay hidden.
              </Typography>
            </div>
          </div>
        </Card>

        <section className="space-y-4">
          <SectionHeader
            title="Pending IDs"
            description={
              loading
                ? "Loading the review queue"
                : items.length === 1
                  ? "1 teacher waiting"
                  : `${items.length} teachers waiting`
            }
          />

          {loading ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="gap-3 p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="size-11 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-56" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-full" />
                </Card>
              ))}
            </div>
          ) : null}

          {error ? (
            <Card className="gap-2 border-destructive/20 bg-destructive/5 p-4 shadow-none">
              <Typography variant="h3" className="text-sm tracking-tight">
                Could not load the queue
              </Typography>
              <Typography variant="muted">{error}</Typography>
            </Card>
          ) : null}

          {!loading && !error && items.length === 0 ? (
            <EmptyState
              icon={IdCard}
              title="No pending IDs"
              description="New teacher submissions will show up here for review."
            />
          ) : null}

          {!loading && items.length > 0 ? (
            <ul className="grid gap-3 lg:grid-cols-2">
              {items.map((item) => {
                const busy = reviewingId === item.id;
                const viewing = documentLoadingId === item.id;
                const name = item.teacherName ?? "Teacher";
                return (
                  <li key={item.id} className="list-none">
                    <Card className="h-full gap-0 overflow-hidden border-border/50 p-0">
                      <div className="flex items-start gap-3 p-4">
                        <Avatar className="size-11">
                          <AvatarFallback className="bg-accent text-sm text-accent-foreground">
                            {initialsFromName(name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <Typography
                              variant="h3"
                              className="text-base tracking-tight">
                              {name}
                            </Typography>
                            <Badge
                              variant="secondary"
                              className="h-6 bg-warning/25 text-warning-foreground">
                              <Typography
                                variant="small"
                                className="text-inherit">
                                Pending
                              </Typography>
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.subjects.length > 0 ? (
                              item.subjects.slice(0, 4).map((subject) => (
                                <Badge
                                  key={subject}
                                  variant="outline"
                                  className="h-6">
                                  <Typography
                                    variant="small"
                                    className="text-inherit">
                                    {subject}
                                  </Typography>
                                </Badge>
                              ))
                            ) : (
                              <Typography variant="muted">
                                No subjects listed
                              </Typography>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
                            <Typography variant="small">
                              {item.classes.length > 0
                                ? `Classes ${[...item.classes]
                                    .sort((a, b) => Number(a) - Number(b))
                                    .join(", ")}`
                                : "Classes not set"}
                            </Typography>
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="size-3.5" aria-hidden />
                              <Typography variant="small">
                                {formatActivityTime(item.createdAt)}
                              </Typography>
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 w-full sm:w-auto"
                          disabled={viewing || busy}
                          onClick={() => void handleViewId(item)}>
                          <IdCard className="size-4" aria-hidden />
                          <Typography variant="button">
                            {viewing ? "Opening…" : "View ID"}
                          </Typography>
                        </Button>
                        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10"
                            disabled={busy}
                            onClick={() => {
                              setRejectItem(item);
                              setRejectReason("");
                            }}>
                            <Typography variant="button">Reject</Typography>
                          </Button>
                          <Button
                            type="button"
                            className="h-10"
                            disabled={busy}
                            onClick={() => void handleApprove(item)}>
                            <Typography
                              variant="button"
                              className="text-primary-foreground">
                              {busy ? "Saving…" : "Approve"}
                            </Typography>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      </PageMain>

      <Sheet
        open={Boolean(documentUrl && reviewItem)}
        onOpenChange={(open) => {
          if (!open) closeDocument();
        }}>
        <SheetContent
          side="right"
          className="data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              <Typography variant="h3" className="text-base tracking-tight">
                {reviewItem?.teacherName ?? "Teacher"} ID
              </Typography>
            </SheetTitle>
            <SheetDescription>
              <Typography variant="muted">
                Expires in a few minutes. Approve or reject from here.
              </Typography>
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-auto px-4">
            {documentUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- short-lived R2 URL
              <img
                src={documentUrl}
                alt="Teacher ID"
                className="w-full rounded-2xl bg-muted object-contain"
              />
            ) : null}
          </div>
          {reviewItem ? (
            <SheetFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full sm:w-auto"
                disabled={reviewingId === reviewItem.id}
                onClick={() => {
                  setRejectItem(reviewItem);
                  setRejectReason("");
                }}>
                <Typography variant="button">Reject</Typography>
              </Button>
              <Button
                type="button"
                className="h-11 w-full sm:w-auto"
                disabled={reviewingId === reviewItem.id}
                onClick={() => void handleApprove(reviewItem)}>
                <Typography
                  variant="button"
                  className="text-primary-foreground">
                  Approve
                </Typography>
              </Button>
            </SheetFooter>
          ) : null}
        </SheetContent>
      </Sheet>

      <Dialog
        open={Boolean(rejectItem)}
        onOpenChange={(open) => {
          if (!open) {
            setRejectItem(null);
            setRejectReason("");
          }
        }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <Typography variant="h3" className="text-base tracking-tight">
                Reject {rejectItem?.teacherName ?? "teacher"}?
              </Typography>
            </DialogTitle>
            <DialogDescription>
              <Typography variant="muted">
                Optional note for the teacher. They can upload a new ID.
              </Typography>
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            maxLength={500}
            placeholder="Reason (optional)"
            onChange={(event) => setRejectReason(event.target.value)}
          />
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full sm:w-auto"
              onClick={() => {
                setRejectItem(null);
                setRejectReason("");
              }}>
              <Typography variant="button">Cancel</Typography>
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-11 w-full sm:w-auto"
              disabled={Boolean(rejectItem && reviewingId === rejectItem.id)}
              onClick={() => void handleRejectConfirm()}>
              <Typography variant="button">Reject ID</Typography>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
