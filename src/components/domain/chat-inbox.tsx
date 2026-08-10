import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { UiChatPreview } from "@/lib/api/mappers";
import { cn } from "@/lib/utils";

type ChatInboxPreview = Pick<
  UiChatPreview,
  "id" | "name" | "lastMessage" | "time" | "requirementLabel" | "unread"
>;

type ChatInboxProps = {
  chats: ChatInboxPreview[];
  basePath: "/parent/chat" | "/teacher/chat";
  activeId?: string;
  className?: string;
};

export function ChatInbox({
  chats,
  basePath,
  activeId,
  className,
}: ChatInboxProps) {
  if (chats.length === 0) {
    return (
      <Card className="items-center gap-3 border-dashed border-border/80 p-8 text-center shadow-none">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <MessageCircle className="size-7" aria-hidden />
        </span>
        <Typography variant="h3" className="text-base tracking-tight">
          No conversations yet
        </Typography>
        <Typography variant="muted">
          When you match with someone, chats will show up here.
        </Typography>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-2 md:space-y-2", className)}>
      {chats.map((chat) => {
        const active = activeId === chat.id;
        return (
          <Link key={chat.id} href={`${basePath}/${chat.id}`} className="block">
            <Card
              className={cn(
                "flex-row items-center gap-3 border-border/50 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift md:p-4",
                active && "border-primary/35 bg-accent/50 shadow-soft"
              )}
            >
              <Avatar className="size-11 md:size-12">
                <AvatarFallback
                  className="bg-accent text-accent-foreground"
                  aria-label={`Conversation with ${chat.name}`}
                >
                  {chat.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <Typography variant="h3" className="truncate text-sm">
                    {chat.name}
                  </Typography>
                  <Typography variant="small" className="shrink-0">
                    {chat.time}
                  </Typography>
                </div>
                <Typography variant="small">{chat.requirementLabel}</Typography>
                <Typography variant="muted" className="truncate text-sm">
                  {chat.lastMessage}
                </Typography>
              </div>
              {chat.unread ? (
                <span className="size-2.5 shrink-0 rounded-full bg-destructive" />
              ) : null}
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export function ChatEmptyDesktopPanel({
  title = "Select a conversation",
  description = "Choose a chat from the list to continue messaging. Keep phone numbers off the chat until you trust the match.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="hidden h-full min-h-[28rem] flex-col items-center justify-center gap-3 border-border/50 bg-muted/25 p-10 text-center shadow-soft lg:flex">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-soft">
        <MessageCircle className="size-7" aria-hidden />
      </span>
      <Typography variant="h3" className="text-lg tracking-tight">
        {title}
      </Typography>
      <Typography variant="muted" className="max-w-sm">
        {description}
      </Typography>
    </Card>
  );
}
