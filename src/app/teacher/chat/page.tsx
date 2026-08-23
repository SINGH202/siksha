"use client";

import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import {
  ChatEmptyDesktopPanel,
  ChatInbox,
} from "@/components/domain/chat-inbox";
import { Typography } from "@/components/typography";
import { useConversations } from "@/hooks/use-conversations";
import { toChatPreview } from "@/lib/api/mappers";

export default function TeacherChatListPage() {
  const { items, loading, error } = useConversations();
  const previews = items.map((item) => toChatPreview(item, "teacher"));

  return (
    <>
      <AppHeader
        title="Messages"
        showBrand={false}
        subtitle="Reply to parents about open leads. Keep contact details on Siksha."
      />
      <PageMain>
        <div className="grid gap-4 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:items-start xl:grid-cols-[400px_minmax(0,1fr)]">
          <section className="min-w-0 space-y-2">
            <SectionHeader
              title={`Inbox (${loading ? "…" : previews.length})`}
              className="hidden lg:flex [&_h3]:text-sm"
            />
            {loading ? (
              <Typography variant="muted">Loading conversations…</Typography>
            ) : null}
            {error ? (
              <Typography variant="muted" className="text-destructive">
                {error}
              </Typography>
            ) : null}
            {!loading && !error ? (
              <ChatInbox chats={previews} basePath="/teacher/chat" />
            ) : null}
          </section>
          <ChatEmptyDesktopPanel title="Select a parent conversation" />
        </div>
      </PageMain>
    </>
  );
}
