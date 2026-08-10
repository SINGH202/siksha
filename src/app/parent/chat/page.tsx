"use client";

import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { ChatEmptyDesktopPanel, ChatInbox } from "@/components/domain/chat-inbox";
import { Typography } from "@/components/typography";
import { useAuth } from "@/hooks/use-auth";
import { useConversations } from "@/hooks/use-conversations";
import { toChatPreview } from "@/lib/api/mappers";

export default function ParentChatListPage() {
  const { user } = useAuth();
  const { items, loading, error } = useConversations();
  const previews = items.map((item) => toChatPreview(item, "parent"));

  return (
    <>
      <AppHeader
        title="Messages"
        showBrand={false}
        subtitle="Chat with tutors about your requirements. Phone numbers stay private."
      />
      <PageMain>
        <div className="grid gap-4 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:items-start xl:grid-cols-[400px_minmax(0,1fr)]">
          <section className="min-w-0">
            <SectionHeader
              title={`Inbox (${loading ? "…" : previews.length})`}
              className="mb-2 hidden lg:flex"
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
              <ChatInbox chats={previews} basePath="/parent/chat" />
            ) : null}
          </section>
          <ChatEmptyDesktopPanel />
        </div>
      </PageMain>
    </>
  );
}
