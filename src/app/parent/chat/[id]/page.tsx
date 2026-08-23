"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Plus, Send, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { ChatBubble } from "@/components/domain/chat-bubble";
import { ChatInbox, ChatThreadSkeleton } from "@/components/domain/chat-inbox";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toastApiError } from "@/hooks/use-auth";
import { useAuth } from "@/hooks/use-auth";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useConversationMessages } from "@/hooks/use-conversation-messages";
import { useConversations } from "@/hooks/use-conversations";
import { useHires } from "@/hooks/use-hires";
import { formatMessageTime, toChatPreview } from "@/lib/api/mappers";
import type { ChatMessage } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function peerInitials(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return initials || "U";
}

export default function ParentChatThreadPage() {
  const params = useParams<{ id: string }>();
  const conversationId = params.id;
  const router = useRouter();
  const { user } = useAuth();

  const { items: conversations } = useConversations();
  const { items: hires } = useHires();

  const [message, setMessage] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const redirectedRef = useRef(false);

  const mergeMessageRef = useRef<(message: ChatMessage) => void>(
    () => undefined,
  );

  const { connected, peerTyping, notifyTyping } = useChatSocket(
    conversationId,
    {
      enabled: Boolean(conversationId),
      selfUserId: user?.id ?? null,
      onMessage: (msg) => mergeMessageRef.current(msg),
    },
  );

  const {
    messages,
    loading,
    error,
    errorStatus,
    nextCursor,
    loadEarlier,
    send,
    mergeMessage,
  } = useConversationMessages(conversationId, {
    pollWhenDisconnected: !connected,
  });

  useEffect(() => {
    mergeMessageRef.current = mergeMessage;
  }, [mergeMessage]);

  useEffect(() => {
    redirectedRef.current = false;
  }, [conversationId]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [conversationId, messages.length]);

  useEffect(() => {
    if (redirectedRef.current) return;
    if (errorStatus !== 403 && errorStatus !== 404) return;
    redirectedRef.current = true;
    toast.error(error ?? "Conversation not found");
    router.replace("/parent/chat");
  }, [errorStatus, error, router]);

  const activeConversation = conversations.find(
    (item) => item.id === conversationId,
  );
  const activePreview = activeConversation
    ? toChatPreview(activeConversation, "parent")
    : null;
  const peerName = activePreview?.name ?? "Tutor";
  const sidebarChats = conversations.map((item) =>
    toChatPreview(item, "parent"),
  );
  const isHired = hires.some((hire) => hire.conversationId === conversationId);

  function handleSend(event: FormEvent) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessage("");
    void send(trimmed).catch((err) =>
      toastApiError(err, "Could not send message"),
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-1 flex-col md:min-h-dvh md:flex-row">
      <aside className="hidden w-full max-w-sm shrink-0 flex-col border-r border-border/50 bg-card p-4 lg:flex xl:max-w-md">
        <Typography variant="h3" className="mb-3 text-base tracking-tight">
          Inbox
        </Typography>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ChatInbox
            chats={sidebarChats}
            basePath="/parent/chat"
            activeId={conversationId}
          />
        </div>
      </aside>

      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-3xl flex-1 flex-col bg-background md:min-h-0 md:max-w-none">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-background/80 px-3 py-3 backdrop-blur-xl md:px-5">
          <Link
            href="/parent/chat"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-10 lg:hidden",
            )}
            aria-label="Back to messages">
            ←
          </Link>
          <Avatar className="size-10 md:size-11">
            <AvatarFallback
              className="bg-accent text-accent-foreground"
              aria-label={`Tutor ${peerName}`}>
              {peerInitials(peerName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <Typography
              variant="h3"
              className="truncate text-sm tracking-tight md:text-base">
              {peerName}
            </Typography>
            <Typography
              variant="small"
              className={peerTyping ? "text-primary italic" : undefined}>
              {peerTyping
                ? "Typing…"
                : (activePreview?.requirementLabel ?? "Tuition chat")}
            </Typography>
          </div>
          {conversationId ? (
            isHired ? (
              <span
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "pointer-events-none rounded-full px-3 md:h-9 md:px-4",
                )}>
                <Typography variant="button">Hired</Typography>
              </span>
            ) : (
              <Link
                href={`/parent/hire/${conversationId}`}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full px-3 md:h-9 md:px-4",
                )}>
                <Typography
                  variant="button"
                  className="text-primary-foreground">
                  Hire
                </Typography>
              </Link>
            )
          ) : null}
        </header>

        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 text-secondary-foreground md:px-5">
          <ShieldCheck className="size-4 shrink-0" aria-hidden />
          <Typography variant="small" className="text-secondary-foreground">
            Keep chat on Siksha — do not share phone numbers
          </Typography>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
          {nextCursor ? (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void loadEarlier()}>
                <Typography variant="button">Load earlier</Typography>
              </Button>
            </div>
          ) : null}

          {loading && messages.length === 0 ? <ChatThreadSkeleton /> : null}

          {error ? (
            <Typography variant="muted" className="text-destructive">
              {error}
            </Typography>
          ) : null}

          {!loading && !error && messages.length === 0 ? (
            <Typography variant="muted">
              No messages yet. Say hello to start the conversation.
            </Typography>
          ) : null}

          {messages.map((item) => (
            <ChatBubble
              key={item.id}
              body={item.body}
              time={formatMessageTime(item.createdAt)}
              variant={item.senderId === user?.id ? "outgoing" : "incoming"}
            />
          ))}
        </div>

        <form
          onSubmit={handleSend}
          className="sticky z-20 flex items-center gap-2 border-t border-border/50 bg-background/95 px-3 py-3 shadow-[0_-8px_24px_rgb(23_23_23/4%)] backdrop-blur-xl md:px-5 bottom-[calc(var(--app-bottom-nav)+env(safe-area-inset-bottom,0px))] md:bottom-0">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-2xl bg-card text-muted-foreground shadow-soft"
            aria-label="Add attachment">
            <Plus className="size-5" />
          </button>
          <Input
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              notifyTyping();
            }}
            placeholder="Message..."
            className="h-11 rounded-full bg-card"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft disabled:pointer-events-none disabled:opacity-50"
            aria-label="Send message">
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
