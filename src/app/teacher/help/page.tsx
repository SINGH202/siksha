"use client";

import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { HelpCenterContent } from "@/components/domain/help-center-content";
import { teacherHelpTopics } from "@/lib/account-defaults";

export default function TeacherHelpPage() {
  return (
    <>
      <AppHeader
        title="Help center"
        showBrand={false}
        backHref="/teacher/profile"
        narrow
        subtitle="Guides for leads, verification, fees, and teaching profile updates."
      />
      <PageMain narrow>
        <HelpCenterContent topics={teacherHelpTopics} roleLabel="teacher" />
      </PageMain>
    </>
  );
}
