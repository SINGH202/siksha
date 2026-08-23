import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  emptyAction?: {
    href: string;
    label: string;
  };
};

export function ChatInbox({
  chats,
  basePath,
  activeId,
  className,
  emptyAction,
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
        {emptyAction ? (
          <Link
            href={emptyAction.href}
            className={cn(buttonVariants(), "mt-1 h-10 lg:hidden")}>
            <Typography variant="button" className="text-primary-foreground">
              {emptyAction.label}
            </Typography>
          </Link>
        ) : null}
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
                active && "border-primary/35 bg-accent/50 shadow-soft",
              )}>
              <Avatar className="size-11 md:size-12">
                <AvatarFallback
                  className="bg-accent text-accent-foreground"
                  aria-label={`Conversation with ${chat.name}`}>
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

export function ChatInboxSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading conversations">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="flex-row items-center gap-3 border-border/50 p-3.5 md:p-4">
          <Skeleton className="size-11 shrink-0 rounded-full md:size-12" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ChatThreadSkeleton() {
  return (
    <div
      className="flex flex-col gap-4"
      aria-busy="true"
      aria-label="Loading messages">
      <div className="mr-auto flex max-w-[75%] flex-col gap-1">
        <Skeleton className="h-16 w-56 rounded-2xl rounded-bl-md" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="ml-auto flex max-w-[75%] flex-col items-end gap-1">
        <Skeleton className="h-12 w-44 rounded-2xl rounded-br-md" />
        <Skeleton className="h-3 w-10" />
      </div>
      <div className="mr-auto flex max-w-[75%] flex-col gap-1">
        <Skeleton className="h-20 w-64 rounded-2xl rounded-bl-md" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export function ChatEmptyDesktopPanel({
  title = "Select a conversation",
  description = "Choose a chat from the list to continue messaging. Keep phone numbers off the chat until you trust the match.",
  action,
}: {
  title?: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
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
      {action ? (
        <Link href={action.href} className={cn(buttonVariants(), "mt-1 h-10")}>
          <Typography variant="button" className="text-primary-foreground">
            {action.label}
          </Typography>
        </Link>
      ) : null}
    </Card>
  );
}
