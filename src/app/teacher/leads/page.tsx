import { RequirementCard } from "@/components/domain/requirement-card";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { teacherLeads } from "@/lib/mock-data";

export default function TeacherLeadsPage() {
  return (
    <>
      <AppHeader title="Leads" showBrand={false} />
      <PageMain>
        <section className="space-y-4">
          <SectionHeader
            title="Open leads"
            description="Matching Class 8–12 home tuition requests in your areas."
          />
          <div className="grid gap-3 lg:grid-cols-2">
            {teacherLeads.map((lead) => (
              <RequirementCard
                key={lead.id}
                requirement={lead}
                href={`/teacher/leads/${lead.id}`}
                className="h-full"
              />
            ))}
          </div>
        </section>
      </PageMain>
    </>
  );
}
