"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FilterChip } from "@/components/domain/filter-chip";
import { StickyCta } from "@/components/domain/sticky-cta";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CLASSES, LOCALITIES, SUBJECTS } from "@/lib/mock-data";

const steps = ["Academics", "Location", "Details"] as const;

export default function NewRequirementPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedClass, setSelectedClass] = useState("10");
  const [subjects, setSubjects] = useState<string[]>(["Mathematics"]);
  const [locality, setLocality] = useState<string>(LOCALITIES[0]);
  const [note, setNote] = useState("");

  function toggleSubject(subject: string) {
    setSubjects((current) =>
      current.includes(subject)
        ? current.filter((item) => item !== subject)
        : [...current, subject]
    );
  }

  function next() {
    if (step < steps.length - 1) {
      setStep((value) => value + 1);
      return;
    }
    router.push("/thank-you");
  }

  return (
    <>
      <AppHeader narrow
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
            <Typography variant="muted">
              Mode is home tuition for MVP. Preferred evenings work best for most
              tutors.
            </Typography>
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
              className="min-h-28 rounded-xl"
            />
          </Card>
        ) : null}
      </PageMain>

      <StickyCta narrow>
        <Button className="h-12 w-full rounded-xl" onClick={next}>
          <Typography variant="button" className="text-primary-foreground">
            {step === steps.length - 1 ? "Submit requirement" : "Continue"}
          </Typography>
        </Button>
      </StickyCta>
    </>
  );
}
