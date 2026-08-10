import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { ChatEmptyDesktopPanel, ChatInbox } from "@/components/domain/chat-inbox";
import { chats } from "@/lib/mock-data";

export default function ParentChatListPage() {
  const parentChats = chats.filter((chat) => chat.roleLabel === "Teacher");

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
              title={`Inbox (${parentChats.length})`}
              className="mb-2 hidden lg:flex"
            />
            <ChatInbox chats={parentChats} basePath="/parent/chat" />
          </section>
          <ChatEmptyDesktopPanel />
        </div>
      </PageMain>
    </>
  );
}
