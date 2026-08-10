"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/domain/empty-state";
import { RequirementCard } from "@/components/domain/requirement-card";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { useLeads } from "@/hooks/use-leads";
import { toUiRequirement } from "@/lib/api/mappers";
import { ClipboardList } from "lucide-react";

export default function TeacherLeadsPage() {
  const router = useRouter();
  const { items, loading, error } = useLeads();

  return (
    <>
      <AppHeader title="Leads" showBrand={false} />
      <PageMain>
        <section className="space-y-4">
          <SectionHeader
            title="Open leads"
            description="Matching Class 8–12 home tuition requests in your areas."
          />
          {loading ? (
            <Typography variant="muted">Loading leads…</Typography>
          ) : null}
          {error ? (
            <Typography variant="muted" className="text-destructive">
              {error}
            </Typography>
          ) : null}
          {!loading && !error && items.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No matching leads"
              description="Complete your teaching profile (subjects, classes, areas) to see open requirements."
              actionLabel="Edit profile"
              onAction={() => {
                router.push("/teacher/profile/edit");
              }}
            />
          ) : null}
          <div className="grid gap-3 lg:grid-cols-2">
            {items.map((lead) => (
              <RequirementCard
                key={lead.id}
                requirement={toUiRequirement(lead)}
                href={`/teacher/leads/${lead.id}`}
                className="h-full"
              />
            ))}
          </div>
          {!loading && items.length > 0 ? (
            <Typography variant="small">
              Tip: keep{" "}
              <Link href="/teacher/profile/edit" className="text-primary underline">
                your profile
              </Link>{" "}
              complete for better matches.
            </Typography>
          ) : null}
        </section>
      </PageMain>
    </>
  );
}
