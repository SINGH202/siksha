"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { FilterChip } from "@/components/domain/filter-chip";
import { TeacherCard } from "@/components/domain/teacher-card";
import { TrustBanner } from "@/components/domain/trust-banner";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { SUBJECTS, teachers } from "@/lib/mock-data";

export default function BrowseTeachersPage() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query, 400);

  const filtered = useMemo(() => {
    const normalized = debouncedQuery.trim().toLowerCase();
    return teachers.filter((teacher) => {
      const matchesSubject = subject
        ? teacher.subjects.some((item) => item === subject)
        : true;
      if (!matchesSubject) return false;
      if (!normalized || normalized.length < 2) return true;
      const haystack = [
        teacher.name,
        ...teacher.subjects,
        ...teacher.areas,
        teacher.classes,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [debouncedQuery, subject]);

  return (
    <>
      <AppHeader
        showNotifications
        notificationsHref="/parent/settings"
        backHref="/parent/home"
        title="Browse tutors"
        subtitle="Verified home tutors in Farrukhabad"
      />
      <PageMain>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by subject, name or area..."
              className="h-12 rounded-xl bg-muted/70 pl-10 md:max-w-xl"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
          <FilterChip
            label="All"
            active={subject === null}
            onClick={() => setSubject(null)}
          />
          {SUBJECTS.map((item) => (
            <FilterChip
              key={item}
              label={item}
              active={subject === item}
              onClick={() => setSubject(item)}
            />
          ))}
        </div>

        <TrustBanner
          title="Matching starts with a requirement"
          description="These are sample profiles. Post what you need so real Farrukhabad tutors can apply."
        />

        <SectionHeader
          title={`${filtered.length} sample tutors near Farrukhabad`}
          description="Preview the kind of teachers who apply after you post"
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              href={`/parent/teachers/${teacher.id}`}
              className="h-full"
            />
          ))}
        </div>
      </PageMain>
    </>
  );
}
