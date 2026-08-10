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
import { useTeacherProfile } from "@/hooks/use-account";
import type { TeacherProfile } from "@/lib/account-defaults";
import { CLASSES, LOCALITIES, SUBJECTS } from "@/lib/mock-data";

export default function EditTeacherProfilePage() {
  const router = useRouter();
  const { value, save, ready } = useTeacherProfile();
  const [form, setForm] = useState<TeacherProfile>(value);

  useEffect(() => {
    if (ready) setForm(value);
  }, [ready, value]);

  function updateField<K extends keyof TeacherProfile>(
    key: K,
    next: TeacherProfile[K]
  ) {
    setForm((current) => ({ ...current, [key]: next }));
  }

  function toggleList(
    key: "subjects" | "classes" | "areas",
    item: string
  ) {
    setForm((current) => {
      const list = current[key];
      return {
        ...current,
        [key]: list.includes(item)
          ? list.filter((value) => value !== item)
          : [...list, item],
      };
    });
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || form.subjects.length === 0 || form.areas.length === 0) {
      toast.error("Name, at least one subject, and one area are required");
      return;
    }
    if (form.feeMin > form.feeMax) {
      toast.error("Minimum fee cannot be greater than maximum fee");
      return;
    }
    save({
      ...form,
      name: form.name.trim(),
      phone: form.phone.replace(/\D/g, "").slice(-10),
      board: form.board.trim(),
      bio: form.bio.trim(),
    });
    toast.success("Teaching profile updated");
    router.push("/teacher/profile");
  }

  return (
    <>
      <AppHeader
        title="Edit profile"
        showBrand={false}
        backHref="/teacher/profile"
        narrow
        subtitle="These details appear on your public tutor profile and lead applications."
      />
      <PageMain narrow className="gap-4 pb-28 md:pb-8">
        {!ready ? (
          <Typography variant="muted">Loading profile...</Typography>
        ) : (
          <form id="teacher-profile-form" className="space-y-4" onSubmit={onSubmit}>
            <Card className="gap-4 border-border/50 p-4 md:p-5">
              <Typography variant="h3" className="text-base tracking-tight">
                Basic details
              </Typography>
              <div className="space-y-2">
                <Label htmlFor="name">
                  <Typography variant="label">Full name</Typography>
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
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="feeMin">
                    <Typography variant="label">Fee min (₹/hr)</Typography>
                  </Label>
                  <Input
                    id="feeMin"
                    inputMode="numeric"
                    value={form.feeMin}
                    onChange={(event) =>
                      updateField("feeMin", Number(event.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feeMax">
                    <Typography variant="label">Fee max (₹/hr)</Typography>
                  </Label>
                  <Input
                    id="feeMax"
                    inputMode="numeric"
                    value={form.feeMax}
                    onChange={(event) =>
                      updateField("feeMax", Number(event.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">
                  <Typography variant="label">Experience (years)</Typography>
                </Label>
                <Input
                  id="experience"
                  inputMode="numeric"
                  value={form.experienceYears}
                  onChange={(event) =>
                    updateField("experienceYears", Number(event.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="board">
                  <Typography variant="label">Board</Typography>
                </Label>
                <Input
                  id="board"
                  value={form.board}
                  onChange={(event) => updateField("board", event.target.value)}
                  placeholder="CBSE / UP Board"
                />
              </div>
            </Card>

            <Card className="gap-4 border-border/50 p-4 md:p-5">
              <Typography variant="h3" className="text-base tracking-tight">
                Teaching profile
              </Typography>
              <div className="space-y-2">
                <Typography variant="label">Subjects</Typography>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((item) => (
                    <FilterChip
                      key={item}
                      label={item}
                      active={form.subjects.includes(item)}
                      onClick={() => toggleList("subjects", item)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Typography variant="label">Classes</Typography>
                <div className="flex flex-wrap gap-2">
                  {CLASSES.map((item) => (
                    <FilterChip
                      key={item}
                      label={`Class ${item}`}
                      active={form.classes.includes(item)}
                      onClick={() => toggleList("classes", item)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Typography variant="label">Areas covered</Typography>
                <div className="flex flex-wrap gap-2">
                  {LOCALITIES.map((item) => (
                    <FilterChip
                      key={item}
                      label={item}
                      active={form.areas.includes(item)}
                      onClick={() => toggleList("areas", item)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">
                  <Typography variant="label">Bio</Typography>
                </Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(event) => updateField("bio", event.target.value)}
                  className="min-h-28"
                />
              </div>
            </Card>
          </form>
        )}
      </PageMain>

      <StickyCta narrow>
        <Button
          type="submit"
          form="teacher-profile-form"
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
