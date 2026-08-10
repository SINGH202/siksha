"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { GraduationCap, Plus, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { ChatBubble } from "@/components/domain/chat-bubble";
import { ChatInbox } from "@/components/domain/chat-inbox";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { chats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const initialMessages = [
  {
    id: "1",
    variant: "outgoing" as const,
    body: "Hello! I saw your profile for Class 10 Maths. Are you available for home tuition in Civil Lines?",
    time: "10:42 AM",
  },
  {
    id: "2",
    variant: "incoming" as const,
    body: "Hi Rahul, yes I am available. I have 5 years of CBSE experience and can start from Monday evening.",
    time: "10:45 AM",
  },
];

export default function ParentChatThreadPage() {
  const params = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const parentChats = chats.filter((chat) => chat.roleLabel === "Teacher");

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
            chats={parentChats}
            basePath="/parent/chat"
            activeId={params.id}
          />
        </div>
      </aside>

      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-3xl flex-1 flex-col bg-background md:min-h-0 md:max-w-none">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-background/80 px-3 py-3 backdrop-blur-xl md:px-5">
          <Link
            href="/parent/chat"
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
              aria-label="Tutor Priya Sharma"
            >
              PS
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <Typography variant="h3" className="truncate text-sm tracking-tight md:text-base">
              Priya Sharma
            </Typography>
            <Typography variant="small" className="text-success-foreground">
              Online · Class 10 Maths
            </Typography>
          </div>
          <Link
            href="/parent/hire/c1"
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-full px-3 md:h-9 md:px-4"
            )}
          >
            <Typography variant="button" className="text-primary-foreground">
              Hire
            </Typography>
          </Link>
        </header>

        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 text-secondary-foreground md:px-5">
          <ShieldCheck className="size-4 shrink-0" aria-hidden />
          <Typography variant="small" className="text-secondary-foreground">
            Keep chat on Siksha — do not share phone numbers
          </Typography>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
          <Card className="mx-auto max-w-xs items-center gap-2 p-4 text-center md:max-w-sm">
            <GraduationCap className="size-5 text-primary" aria-hidden />
            <Typography variant="small">
              Conversation about requirement
            </Typography>
            <Badge
              variant="secondary"
              className="bg-warning/50 text-warning-foreground"
            >
              <Typography variant="small" className="text-warning-foreground">
                Class 10 Maths
              </Typography>
            </Badge>
          </Card>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <Typography variant="small">Today</Typography>
            <Separator className="flex-1" />
          </div>

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
          className="sticky bottom-16 z-20 flex items-center gap-2 border-t border-border/50 bg-background/80 px-3 py-3 shadow-[0_-8px_24px_rgb(23_23_23/4%)] backdrop-blur-xl safe-bottom md:bottom-0 md:px-5"
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
