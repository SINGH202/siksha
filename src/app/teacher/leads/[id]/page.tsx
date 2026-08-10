"use client";

import { useParams, useRouter } from "next/navigation";
import { BookOpen, CalendarDays, MapPin, Quote, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/domain/status-badge";
import { StickyCta } from "@/components/domain/sticky-cta";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toastApiError } from "@/hooks/use-auth";
import { useLeads } from "@/hooks/use-leads";
import { getRequirement } from "@/lib/api/requirements";
import { toUiRequirement } from "@/lib/api/mappers";
import type { Requirement } from "@/lib/api/types";

export default function TeacherLeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { apply } = useLeads();
  const [lead, setLead] = useState<Requirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [fee, setFee] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      void getRequirement(params.id, controller.signal)
        .then((data) => {
          if (!controller.signal.aborted) setLead(data);
        })
        .catch(() => {
          if (!controller.signal.aborted) setLead(null);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [params.id]);

  async function submitApplication() {
    if (!note.trim()) {
      toast.error("Add a short note for the parent");
      return;
    }
    setSubmitting(true);
    try {
      const proposedFee = fee.trim() ? Number(fee) : undefined;
      await apply(params.id, {
        note: note.trim(),
        proposedFee:
          proposedFee !== undefined && !Number.isNaN(proposedFee)
            ? proposedFee
            : undefined,
      });
      toast.success("Application sent");
      setOpen(false);
      router.push("/teacher/leads");
    } catch (error) {
      toastApiError(error, "Could not apply");
    } finally {
      setSubmitting(false);
    }
  }

  const ui = lead ? toUiRequirement(lead) : null;

  return (
    <>
      <AppHeader
        narrow
        title="Lead details"
        showBrand={false}
        backHref="/teacher/leads"
      />
      <PageMain narrow>
        {loading ? (
          <Typography variant="muted">Loading lead…</Typography>
        ) : !lead || !ui ? (
          <Typography variant="muted">Lead not found or not available.</Typography>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={ui.status} />
                <Typography variant="small">Posted {ui.postedAgo}</Typography>
              </div>
              <Typography
                variant="h2"
                className="text-xl tracking-tight md:text-2xl"
              >
                {lead.title}
              </Typography>
            </div>

            <Card className="gap-3 p-4 md:p-5">
              <div className="flex items-center gap-2 text-primary">
                <span className="flex size-8 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
                  <BookOpen className="size-4" />
                </span>
                <Typography
                  variant="h3"
                  className="text-sm tracking-tight text-primary"
                >
                  Academic requirements
                </Typography>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Typography variant="label">Class</Typography>
                  <Typography variant="bodySmall" className="font-medium">
                    Class {lead.classLabel}
                  </Typography>
                </div>
                <div>
                  <Typography variant="label">Board</Typography>
                  <Typography variant="bodySmall" className="font-medium">
                    {lead.board || "—"}
                  </Typography>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {lead.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary" className="h-7 bg-accent">
                    <Typography variant="small" className="text-accent-foreground">
                      {subject}
                    </Typography>
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="gap-3 p-4 md:p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <Typography variant="label">Location</Typography>
                  <Typography variant="bodySmall" className="font-medium">
                    {lead.locality} ·{" "}
                    {lead.mode === "home" ? "In-person" : "Online"}
                  </Typography>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
                  <CalendarDays className="size-4" />
                </span>
                <div>
                  <Typography variant="label">Schedule</Typography>
                  <Typography variant="bodySmall" className="font-medium">
                    {lead.schedule}
                  </Typography>
                  {lead.scheduleDetail ? (
                    <Typography variant="muted">{lead.scheduleDetail}</Typography>
                  ) : null}
                </div>
              </div>
            </Card>

            {lead.note ? (
              <Card className="gap-2 border-0 bg-accent/70 p-4 shadow-none">
                <div className="flex items-center gap-2 text-primary">
                  <span className="flex size-8 items-center justify-center rounded-2xl bg-card text-primary shadow-soft">
                    <Quote className="size-4" />
                  </span>
                  <Typography
                    variant="h3"
                    className="text-sm tracking-tight text-primary"
                  >
                    Note from parent
                  </Typography>
                </div>
                <Typography variant="muted" className="italic">
                  {lead.note}
                </Typography>
              </Card>
            ) : null}
          </>
        )}
      </PageMain>

      {lead ? (
        <StickyCta narrow>
          <Button
            className="h-12 w-full"
            onClick={() => setOpen(true)}
          >
            <Send className="size-4" />
            <Typography variant="button" className="text-primary-foreground">
              Apply now
            </Typography>
          </Button>
        </StickyCta>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              <Typography variant="h3">Apply to this lead</Typography>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Typography variant="label">Proposed fee (₹ / hour)</Typography>
              <Input
                value={fee}
                inputMode="numeric"
                onChange={(event) => setFee(event.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1.5">
              <Typography variant="label">Note to parent</Typography>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="min-h-24"
                placeholder="Share availability and approach…"
              />
            </div>
            <Button
              className="h-11 w-full"
              disabled={submitting}
              onClick={() => void submitApplication()}
            >
              <Typography variant="button" className="text-primary-foreground">
                {submitting ? "Sending…" : "Submit application"}
              </Typography>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
