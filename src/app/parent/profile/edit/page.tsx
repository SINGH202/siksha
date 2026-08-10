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
import { toastApiError } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { isParentProfileMe } from "@/lib/api/types";
import { LOCALITIES } from "@/lib/mock-data";

type ParentProfileFormProps = {
  initialName: string;
  initialLocality: string;
  onSave: (input: { name: string; locality?: string }) => Promise<void>;
};

function ParentProfileForm({
  initialName,
  initialLocality,
  onSave,
}: ParentProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [locality, setLocality] = useState(initialLocality);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    await onSave({
      name: name.trim(),
      locality: locality.trim() || undefined,
    });
  }

  return (
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
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Typography variant="label">Locality</Typography>
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
        </div>
      </Card>
    </form>
  );
}

export default function EditParentProfilePage() {
  const router = useRouter();
  const { data, loading, saveParent } = useProfile();
  const [submitting, setSubmitting] = useState(false);
  const profile =
    data && isParentProfileMe(data) ? data.profile : null;

  async function handleSave(input: { name: string; locality?: string }) {
    setSubmitting(true);
    try {
      await saveParent(input);
      toast.success("Profile updated");
      router.push("/parent/profile");
    } catch (error) {
      toastApiError(error, "Could not save profile");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AppHeader
        title="Edit profile"
        showBrand={false}
        backHref="/parent/profile"
        narrow
        subtitle="Name and locality help teachers understand your area."
      />
      <PageMain narrow className="gap-4 pb-28 md:pb-8">
        {loading ? (
          <Typography variant="muted">Loading profile…</Typography>
        ) : (
          <ParentProfileForm
            key={profile?.id ?? "new-parent-profile"}
            initialName={profile?.name ?? ""}
            initialLocality={profile?.locality || LOCALITIES[0]}
            onSave={handleSave}
          />
        )}
      </PageMain>
      {!loading ? (
        <StickyCta narrow>
          <Button
            type="submit"
            form="parent-profile-form"
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
