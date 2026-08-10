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
import { useProfile } from "@/hooks/use-profile";
import type { UpdateTeacherProfileInput } from "@/lib/api/types";
import { isTeacherProfileMe } from "@/lib/api/types";
import { CLASSES, LOCALITIES, SUBJECTS } from "@/lib/mock-data";

type TeacherProfileFormProps = {
  initial: UpdateTeacherProfileInput;
  onSave: (input: UpdateTeacherProfileInput) => Promise<void>;
};

function TeacherProfileForm({
  initial,
  onSave,
}: TeacherProfileFormProps) {
  const [name, setName] = useState(initial.name);
  const [bio, setBio] = useState(initial.bio ?? "");
  const [subjects, setSubjects] = useState(initial.subjects);
  const [classes, setClasses] = useState(initial.classes);
  const [localities, setLocalities] = useState(initial.localities);
  const [coversAllLocalities, setCoversAllLocalities] = useState(
    initial.coversAllLocalities
  );
  const [feeMin, setFeeMin] = useState(initial.feeMin ?? 400);
  const [feeMax, setFeeMax] = useState(initial.feeMax ?? 600);

  function toggle(
    list: string[],
    item: string,
    setter: (next: string[]) => void
  ) {
    setter(
      list.includes(item)
        ? list.filter((value) => value !== item)
        : [...list, item]
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || subjects.length === 0 || classes.length === 0) {
      toast.error("Name, subjects, and classes are required");
      return;
    }
    if (!coversAllLocalities && localities.length === 0) {
      toast.error("Select areas or choose covers all localities");
      return;
    }
    if (feeMin > feeMax) {
      toast.error("Minimum fee cannot be greater than maximum fee");
      return;
    }
    await onSave({
      name: name.trim(),
      bio: bio.trim() || undefined,
      subjects,
      classes,
      localities: coversAllLocalities ? [] : localities,
      coversAllLocalities,
      feeMin,
      feeMax,
    });
  }

  return (
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
            value={name}
            onChange={(event) => setName(event.target.value)}
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
              value={feeMin}
              onChange={(event) => setFeeMin(Number(event.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feeMax">
              <Typography variant="label">Fee max (₹/hr)</Typography>
            </Label>
            <Input
              id="feeMax"
              inputMode="numeric"
              value={feeMax}
              onChange={(event) => setFeeMax(Number(event.target.value) || 0)}
            />
          </div>
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
                active={subjects.includes(item)}
                onClick={() => toggle(subjects, item, setSubjects)}
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
                active={classes.includes(item)}
                onClick={() => toggle(classes, item, setClasses)}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Typography variant="label">Areas covered</Typography>
          <FilterChip
            label="All Farrukhabad"
            active={coversAllLocalities}
            onClick={() => setCoversAllLocalities((value) => !value)}
          />
          {!coversAllLocalities ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {LOCALITIES.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  active={localities.includes(item)}
                  onClick={() => toggle(localities, item, setLocalities)}
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">
            <Typography variant="label">Bio</Typography>
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className="min-h-28"
          />
        </div>
      </Card>
    </form>
  );
}

export default function EditTeacherProfilePage() {
  const router = useRouter();
  const { data, loading, saveTeacher } = useProfile();
  const [submitting, setSubmitting] = useState(false);
  const profile =
    data && isTeacherProfileMe(data) ? data.profile : null;

  async function handleSave(input: UpdateTeacherProfileInput) {
    setSubmitting(true);
    try {
      await saveTeacher(input);
      toast.success("Teaching profile updated");
      router.push("/teacher/profile");
    } catch (error) {
      toastApiError(error, "Could not save profile");
    } finally {
      setSubmitting(false);
    }
  }

  const initial: UpdateTeacherProfileInput = {
    name: profile?.name ?? "",
    bio: profile?.bio ?? "",
    subjects: profile?.subjects ?? [],
    classes: profile?.classes ?? [],
    localities: profile?.localities ?? [],
    coversAllLocalities: profile?.coversAllLocalities ?? false,
    feeMin: profile?.feeMin ?? 400,
    feeMax: profile?.feeMax ?? 600,
  };

  return (
    <>
      <AppHeader
        title="Edit profile"
        showBrand={false}
        backHref="/teacher/profile"
        narrow
        subtitle="Complete this to unlock matching leads."
      />
      <PageMain narrow className="gap-4 pb-28 md:pb-8">
        {loading ? (
          <Typography variant="muted">Loading profile…</Typography>
        ) : (
          <TeacherProfileForm
            key={profile?.id ?? "new-teacher-profile"}
            initial={initial}
            onSave={handleSave}
          />
        )}
      </PageMain>
      {!loading ? (
        <StickyCta narrow>
          <Button
            type="submit"
            form="teacher-profile-form"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            <Typography variant="button" className="text-primary-foreground">
              {submitting ? "Saving…" : "Save changes"}
            </Typography>
          </Button>
        </StickyCta>
      ) : null}
    </>
  );
}
