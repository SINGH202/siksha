"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useParentProfile } from "@/hooks/use-account";
import type { ParentProfile } from "@/lib/account-defaults";
import { CLASSES, LOCALITIES, SUBJECTS } from "@/lib/mock-data";

export default function EditParentProfilePage() {
  const router = useRouter();
  const { value, save, ready } = useParentProfile();
  const [form, setForm] = useState<ParentProfile>(value);

  useEffect(() => {
    if (ready) setForm(value);
  }, [ready, value]);

  function updateField<K extends keyof ParentProfile>(
    key: K,
    next: ParentProfile[K]
  ) {
    setForm((current) => ({ ...current, [key]: next }));
  }

  function toggleSubject(subject: string) {
    setForm((current) => ({
      ...current,
      preferredSubjects: current.preferredSubjects.includes(subject)
        ? current.preferredSubjects.filter((item) => item !== subject)
        : [...current.preferredSubjects, subject],
    }));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || form.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please add a valid name and 10-digit phone number");
      return;
    }
    save({
      ...form,
      name: form.name.trim(),
      phone: form.phone.replace(/\D/g, "").slice(-10),
      studentName: form.studentName.trim(),
      notes: form.notes.trim(),
    });
    toast.success("Profile updated");
    router.push("/parent/profile");
  }

  return (
    <>
      <AppHeader
        title="Edit profile"
        showBrand={false}
        backHref="/parent/profile"
        narrow
        subtitle="Update the details teachers see when they apply to your requirements."
      />
      <PageMain narrow className="gap-4 pb-28 md:pb-8">
        {!ready ? (
          <Typography variant="muted">Loading profile...</Typography>
        ) : (
          <form id="parent-profile-form" className="space-y-4" onSubmit={onSubmit}>
            <Card className="gap-4 border-border/50 p-4 md:p-5">
              <Typography variant="h3" className="text-base tracking-tight">
                Your details
              </Typography>
              <div className="space-y-2">
                <Label htmlFor="name">
                  <Typography variant="label">Your name</Typography>
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Typography variant="label">Mobile number</Typography>
                </Label>
                <Input
                  id="phone"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Typography variant="label">Locality</Typography>
                <div className="flex flex-wrap gap-2">
                  {LOCALITIES.map((item) => (
                    <FilterChip
                      key={item}
                      label={item}
                      active={form.locality === item}
                      onClick={() => updateField("locality", item)}
                    />
                  ))}
                </div>
              </div>
            </Card>

            <Card className="gap-4 border-border/50 p-4 md:p-5">
              <Typography variant="h3" className="text-base tracking-tight">
                Student preferences
              </Typography>
              <div className="space-y-2">
                <Label htmlFor="studentName">
                  <Typography variant="label">Student name</Typography>
                </Label>
                <Input
                  id="studentName"
                  value={form.studentName}
                  onChange={(event) =>
                    updateField("studentName", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Typography variant="label">Student class</Typography>
                <div className="flex flex-wrap gap-2">
                  {CLASSES.map((item) => (
                    <FilterChip
                      key={item}
                      label={`Class ${item}`}
                      active={form.studentClass === item}
                      onClick={() => updateField("studentClass", item)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Typography variant="label">Preferred subjects</Typography>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((item) => (
                    <FilterChip
                      key={item}
                      label={item}
                      active={form.preferredSubjects.includes(item)}
                      onClick={() => toggleSubject(item)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">
                  <Typography variant="label">Notes for tutors</Typography>
                </Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  className="min-h-24"
                />
              </div>
            </Card>
          </form>
        )}
      </PageMain>

      <StickyCta narrow>
        <Button
          type="submit"
          form="parent-profile-form"
          size="lg"
          className="w-full"
          disabled={!ready}
        >
          <Typography variant="button" className="text-primary-foreground">
            Save changes
          </Typography>
        </Button>
      </StickyCta>
    </>
  );
}
