import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { ChatEmptyDesktopPanel, ChatInbox } from "@/components/domain/chat-inbox";
import { chats } from "@/lib/mock-data";

export default function TeacherChatListPage() {
  const teacherChats = chats.filter((chat) => chat.roleLabel === "Parent");

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
              title={`Inbox (${teacherChats.length})`}
              className="hidden lg:flex [&_h3]:text-sm"
            />
            <ChatInbox chats={teacherChats} basePath="/teacher/chat" />
          </section>
          <ChatEmptyDesktopPanel title="Select a parent conversation" />
        </div>
      </PageMain>
    </>
  );
}
