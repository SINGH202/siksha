import { io, type Socket } from "socket.io-client";
import type { ChatMessage } from "@/lib/api/types";

function apiOrigin() {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not configured");
  return base;
}

export function connectChatSocket(accessToken: string): Socket {
  return io(`${apiOrigin()}/chat`, {
    auth: { token: accessToken },
    transports: ["websocket", "polling"],
    autoConnect: true,
  });
}

export function disconnectChatSocket(socket: Socket) {
  socket.disconnect();
}

export function joinConversation(
  socket: Socket,
  conversationId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  return new Promise((resolve) => {
    socket.emit("join", { conversationId }, (ack: { ok: boolean; error?: string }) => {
      resolve(
        ack?.ok
          ? { ok: true }
          : { ok: false, error: ack?.error ?? "join failed" }
      );
    });
  });
}

export function emitTyping(socket: Socket, conversationId: string) {
  socket.emit("typing", { conversationId });
}

export type MessageNewHandler = (message: ChatMessage) => void;
export type TypingHandler = (payload: {
  conversationId: string;
  userId: string;
}) => void;

export function onMessageNew(socket: Socket, handler: MessageNewHandler) {
  socket.on("message:new", handler);
  return () => {
    socket.off("message:new", handler);
  };
}

export function onTyping(socket: Socket, handler: TypingHandler) {
  socket.on("typing", handler);
  return () => {
    socket.off("typing", handler);
  };
}
