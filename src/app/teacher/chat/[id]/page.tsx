"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Plus, Send, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { ChatBubble } from "@/components/domain/chat-bubble";
import { ChatInbox } from "@/components/domain/chat-inbox";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toastApiError } from "@/hooks/use-auth";
import { useAuth } from "@/hooks/use-auth";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useConversationMessages } from "@/hooks/use-conversation-messages";
import { useConversations } from "@/hooks/use-conversations";
import { useHires } from "@/hooks/use-hires";
import { ApiError } from "@/lib/api/client";
import * as conversationsApi from "@/lib/api/conversations";
import { formatMessageTime, toChatPreview } from "@/lib/api/mappers";
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

export default function TeacherChatThreadPage() {
  const params = useParams<{ id: string }>();
  const conversationId = params.id;
  const router = useRouter();
  const { user } = useAuth();

  const { items: conversations } = useConversations();
  const { items: hires } = useHires();

  const [message, setMessage] = useState("");
  // Starts true (assume disconnected) so we poll until the socket confirms
  // it is connected; synced from `connected` below (mirrors the same
  // set-state-in-effect pattern already used inside useChatSocket).
  const [pollWhenDisconnected, setPollWhenDisconnected] = useState(true);

  const { messages, loading, error, nextCursor, loadEarlier, send, mergeMessage } =
    useConversationMessages(conversationId, { pollWhenDisconnected });

  const { connected, peerTyping, notifyTyping } = useChatSocket(conversationId, {
    enabled: Boolean(conversationId),
    selfUserId: user?.id ?? null,
    onMessage: mergeMessage,
  });

  useEffect(() => {
    setPollWhenDisconnected(!connected);
  }, [connected]);

  useEffect(() => {
    if (!conversationId) return;
    const controller = new AbortController();
    conversationsApi
      .listMessages(conversationId, undefined, controller.signal)
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (err instanceof ApiError && (err.statusCode === 403 || err.statusCode === 404)) {
          toastApiError(err, "Conversation not found");
          router.replace("/teacher/chat");
        }
      });
    return () => controller.abort();
  }, [conversationId, router]);

  const activeConversation = conversations.find((item) => item.id === conversationId);
  const activePreview = activeConversation
    ? toChatPreview(activeConversation, "teacher")
    : null;
  const peerName = activePreview?.name ?? "Parent";
  const sidebarChats = conversations.map((item) => toChatPreview(item, "teacher"));
  const isHired = hires.some((hire) => hire.conversationId === conversationId);

  function handleSend(event: FormEvent) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessage("");
    void send(trimmed).catch((err) => toastApiError(err, "Could not send message"));
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
            basePath="/teacher/chat"
            activeId={conversationId}
          />
        </div>
      </aside>

      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-3xl flex-1 flex-col bg-background md:min-h-0 md:max-w-none">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-background/80 px-3 py-3 backdrop-blur-xl md:px-5">
          <Link
            href="/teacher/chat"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-10 lg:hidden"
            )}
            aria-label="Back to messages"
          >
            ←
          </Link>
          <Avatar className="size-10 md:size-11">
            <AvatarFallback
              className="bg-accent text-accent-foreground"
              aria-label={`Parent ${peerName}`}
            >
              {peerInitials(peerName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <Typography variant="h3" className="truncate text-sm tracking-tight md:text-base">
              {peerName}
            </Typography>
            <Typography
              variant="small"
              className={peerTyping ? "text-primary italic" : undefined}
            >
              {peerTyping ? "Typing…" : activePreview?.requirementLabel ?? "Tuition chat"}
            </Typography>
          </div>
          {isHired ? (
            <Badge variant="secondary" className="h-6 bg-accent text-accent-foreground">
              <Typography variant="small" className="text-accent-foreground">
                Hired
              </Typography>
            </Badge>
          ) : null}
        </header>

        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 md:px-5">
          <ShieldCheck className="size-4 shrink-0 text-secondary-foreground" aria-hidden />
          <Typography variant="small" className="text-secondary-foreground">
            Keep chat on Siksha — do not share phone numbers
          </Typography>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
          {nextCursor ? (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={() => void loadEarlier()}>
                <Typography variant="button">Load earlier</Typography>
              </Button>
            </div>
          ) : null}

          {loading && messages.length === 0 ? (
            <Typography variant="muted">Loading messages…</Typography>
          ) : null}

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
          className="sticky bottom-16 z-20 flex items-center gap-2 border-t border-border/50 bg-background/80 px-3 py-3 backdrop-blur-xl md:bottom-0 md:px-5"
        >
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-2xl bg-card text-muted-foreground shadow-soft"
            aria-label="Add attachment"
          >
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
            aria-label="Send message"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
