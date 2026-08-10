"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { ChatBubble } from "@/components/domain/chat-bubble";
import { ChatInbox } from "@/components/domain/chat-inbox";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function TeacherChatThreadPage() {
  const params = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      variant: "incoming" as const,
      body: "Are you available for home tuition in Civil Lines?",
      time: "10:42 AM",
    },
    {
      id: "2",
      variant: "outgoing" as const,
      body: "Yes, I can start from Monday evening.",
      time: "10:45 AM",
    },
  ]);
  const teacherChats = chats.filter((chat) => chat.roleLabel === "Parent");

  function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setMessages((current) => [
      ...current,
      {
        id: String(current.length + 1),
        variant: "outgoing",
        body: message.trim(),
        time: "Now",
      },
    ]);
    setMessage("");
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-1 flex-col md:min-h-dvh md:flex-row">
      <aside className="hidden w-full max-w-sm shrink-0 flex-col border-r border-border/50 bg-card p-4 lg:flex xl:max-w-md">
        <Typography variant="h3" className="mb-3 text-base tracking-tight">
          Inbox
        </Typography>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ChatInbox
            chats={teacherChats}
            basePath="/teacher/chat"
            activeId={params.id}
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
              aria-label="Parent Rahul"
            >
              RS
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <Typography variant="h3" className="truncate text-sm tracking-tight md:text-base">
              Rahul (Parent)
            </Typography>
            <Typography variant="small">Class 10 Maths</Typography>
          </div>
        </header>

        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 md:px-5">
          <ShieldCheck className="size-4 shrink-0 text-secondary-foreground" aria-hidden />
          <Typography variant="small" className="text-secondary-foreground">
            Keep chat on Siksha — do not share phone numbers
          </Typography>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
          {messages.map((item) => (
            <ChatBubble
              key={item.id}
              body={item.body}
              time={item.time}
              variant={item.variant}
            />
          ))}
        </div>

        <form
          onSubmit={sendMessage}
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
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Message..."
            className="h-11 rounded-full bg-card"
          />
          <button
            type="submit"
            className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft"
            aria-label="Send message"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
