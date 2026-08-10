"use client";

import { useParams, useRouter } from "next/navigation";
import { BookOpen, CalendarDays, MapPin, Quote, Send } from "lucide-react";
import { useMemo, useState } from "react";

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
import { teacherLeads } from "@/lib/mock-data";

export default function TeacherLeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fee, setFee] = useState("550");
  const [note, setNote] = useState("");

  const lead = useMemo(
    () => teacherLeads.find((item) => item.id === params.id) ?? teacherLeads[0],
    [params.id]
  );

  return (
    <>
      <AppHeader narrow title="Lead details" showBrand={false} backHref="/teacher/leads" />
      <PageMain narrow>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={lead.status} />
            <Typography variant="small">Posted {lead.postedAgo}</Typography>
          </div>
          <Typography variant="h2" className="text-xl tracking-tight md:text-2xl">
            {lead.title}
          </Typography>
        </div>

        <Card className="gap-3 p-4 md:p-5">
          <div className="flex items-center gap-2 text-primary">
            <span className="flex size-8 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
              <BookOpen className="size-4" />
            </span>
            <Typography variant="h3" className="text-sm tracking-tight text-primary">
              Academic requirements
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Typography variant="label">Class</Typography>
              <Typography variant="bodySmall" className="font-medium">
                {lead.classLabel}
              </Typography>
            </div>
            <div>
              <Typography variant="label">Board</Typography>
              <Typography variant="bodySmall" className="font-medium">
                {lead.board}
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
                {lead.locality}
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
              <Typography variant="muted">{lead.scheduleDetail}</Typography>
            </div>
          </div>
        </Card>

        {lead.note ? (
          <Card className="gap-2 border-0 bg-accent/70 p-4 shadow-none">
            <div className="flex items-center gap-2 text-primary">
              <span className="flex size-8 items-center justify-center rounded-2xl bg-card text-primary shadow-soft">
                <Quote className="size-4" />
              </span>
              <Typography variant="h3" className="text-sm tracking-tight text-primary">
                Note from parent
              </Typography>
            </div>
            <Typography variant="muted" className="italic">
              {lead.note}
            </Typography>
          </Card>
        ) : null}
      </PageMain>

      <StickyCta narrow className="pb-24 md:pb-8">
        <Button className="h-12 w-full rounded-xl" onClick={() => setOpen(true)}>
          <Send className="size-4" />
          <Typography variant="button" className="text-primary-foreground">
            Apply now
          </Typography>
        </Button>
      </StickyCta>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              <Typography variant="h3">Apply to this lead</Typography>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Typography variant="label">Proposed fee (₹ / class)</Typography>
              <Input
                value={fee}
                onChange={(event) => setFee(event.target.value)}
                inputMode="numeric"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Typography variant="label">Short note</Typography>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Share experience and availability..."
                className="min-h-24 rounded-xl"
              />
            </div>
            <Button
              className="h-11 w-full rounded-xl"
              onClick={() => {
                setOpen(false);
                router.push("/teacher/chat/c2");
              }}
            >
              <Typography variant="button" className="text-primary-foreground">
                Submit application
              </Typography>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
