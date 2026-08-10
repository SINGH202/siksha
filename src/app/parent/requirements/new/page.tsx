"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { FilterChip } from "@/components/domain/filter-chip";
import { StickyCta } from "@/components/domain/sticky-cta";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toastApiError } from "@/hooks/use-auth";
import { useMyRequirements } from "@/hooks/use-requirements";
import type { ClassLabel, RequirementMode } from "@/lib/api/types";
import { CLASSES, LOCALITIES, SUBJECTS } from "@/lib/mock-data";

const steps = ["Academics", "Location", "Details"] as const;

export default function NewRequirementPage() {
  const router = useRouter();
  const { create } = useMyRequirements();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState<ClassLabel>("10");
  const [subjects, setSubjects] = useState<string[]>(["Mathematics"]);
  const [board, setBoard] = useState("CBSE");
  const [locality, setLocality] = useState<string>(LOCALITIES[0]);
  const [mode, setMode] = useState<RequirementMode>("home");
  const [schedule, setSchedule] = useState("Weekday evenings");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleSubject(subject: string) {
    setSubjects((current) =>
      current.includes(subject)
        ? current.filter((item) => item !== subject)
        : [...current, subject]
    );
  }

  async function next() {
    if (step === 0 && subjects.length === 0) {
      toast.error("Select at least one subject");
      return;
    }
    if (step < steps.length - 1) {
      setStep((value) => value + 1);
      return;
    }

    const resolvedTitle =
      title.trim() ||
      `${subjects.slice(0, 2).join(" & ")} tutor for Class ${selectedClass}`;

    setSubmitting(true);
    try {
      await create({
        title: resolvedTitle,
        classLabel: selectedClass,
        board: board.trim() || undefined,
        subjects,
        locality,
        mode,
        schedule: schedule.trim() || "Flexible",
        note: note.trim() || undefined,
      });
      toast.success("Requirement posted");
      router.push("/thank-you");
    } catch (error) {
      toastApiError(error, "Could not post requirement");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AppHeader
        narrow
        title="Post requirement"
        showBrand={false}
        backHref="/parent/home"
      />
      <PageMain narrow className="gap-5">
        <div className="flex gap-2">
          {steps.map((label, index) => (
            <div key={label} className="flex-1 space-y-1">
              <div
                className={`h-1.5 rounded-full ${
                  index <= step ? "bg-primary" : "bg-muted"
                }`}
              />
              <Typography variant="small">{label}</Typography>
            </div>
          ))}
        </div>

        {step === 0 ? (
          <Card className="gap-4 p-4 md:p-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                <Typography variant="label">Title (optional)</Typography>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Class 10 Maths home tutor"
              />
            </div>
            <div className="space-y-2">
              <Typography variant="label">Class</Typography>
              <div className="flex flex-wrap gap-2">
                {CLASSES.map((item) => (
                  <FilterChip
                    key={item}
                    label={`Class ${item}`}
                    active={selectedClass === item}
                    onClick={() => setSelectedClass(item)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Typography variant="label">Subjects</Typography>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((item) => (
                  <FilterChip
                    key={item}
                    label={item}
                    active={subjects.includes(item)}
                    onClick={() => toggleSubject(item)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="board">
                <Typography variant="label">Board</Typography>
              </Label>
              <Input
                id="board"
                value={board}
                onChange={(event) => setBoard(event.target.value)}
                placeholder="CBSE / UP Board"
              />
            </div>
          </Card>
        ) : null}

        {step === 1 ? (
          <Card className="gap-4 p-4 md:p-6">
            <Typography variant="label">Locality in Farrukhabad</Typography>
            <div className="flex flex-wrap gap-2">
              {LOCALITIES.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  active={locality === item}
                  onClick={() => setLocality(item)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Typography variant="label">Mode</Typography>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="Home tuition"
                  active={mode === "home"}
                  onClick={() => setMode("home")}
                />
                <FilterChip
                  label="Online"
                  active={mode === "online"}
                  onClick={() => setMode("online")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">
                <Typography variant="label">Schedule</Typography>
              </Label>
              <Input
                id="schedule"
                value={schedule}
                onChange={(event) => setSchedule(event.target.value)}
                placeholder="Weekday evenings"
              />
            </div>
          </Card>
        ) : null}

        {step === 2 ? (
          <Card className="gap-3 p-4 md:p-6">
            <Label htmlFor="note">
              <Typography variant="label">Note for teachers (optional)</Typography>
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Share board, weak topics, or preferred days..."
              className="min-h-28"
            />
          </Card>
        ) : null}
      </PageMain>

      <StickyCta narrow>
        <Button
          className="h-12 w-full"
          onClick={() => void next()}
          disabled={submitting}
        >
          <Typography variant="button" className="text-primary-foreground">
            {submitting
              ? "Submitting…"
              : step === steps.length - 1
                ? "Submit requirement"
                : "Continue"}
          </Typography>
        </Button>
      </StickyCta>
    </>
  );
}
