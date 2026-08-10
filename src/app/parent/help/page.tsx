"use client";

import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { HelpCenterContent } from "@/components/domain/help-center-content";
import { parentHelpTopics } from "@/lib/account-defaults";

export default function ParentHelpPage() {
  return (
    <>
      <AppHeader
        title="Help center"
        showBrand={false}
        backHref="/parent/profile"
        narrow
        subtitle="Guides for posting requirements, chat safety, and hiring tutors."
      />
      <PageMain narrow>
        <HelpCenterContent topics={parentHelpTopics} roleLabel="parent" />
      </PageMain>
    </>
  );
}
