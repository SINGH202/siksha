"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

import {
  connectChatSocket,
  disconnectChatSocket,
  emitTyping,
  joinConversation,
  onMessageNew,
  onTyping,
} from "@/lib/api/chat-socket";
import type { ChatMessage } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/session";

const TYPING_CLEAR_MS = 2000;
const TYPING_DEBOUNCE_MS = 400;

export type UseChatSocketOptions = {
  enabled: boolean;
  onMessage: (message: ChatMessage) => void;
  selfUserId: string | null;
};

export function useChatSocket(
  conversationId: string | null,
  options: UseChatSocketOptions
) {
  const { enabled, onMessage, selfUserId } = options;

  const [connected, setConnected] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);

  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const selfUserIdRef = useRef(selfUserId);
  selfUserIdRef.current = selfUserId;

  const joinedRef = useRef(false);
  const typingTimerRef = useRef<number | null>(null);
  const peerTypingClearRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    joinedRef.current = false;
    setConnected(false);
    setPeerTyping(false);

    if (!enabled || !conversationId) {
      return;
    }

    const token = getAccessToken();
    if (!token) {
      return;
    }

    const socket = connectChatSocket(token);
    socketRef.current = socket;

    let cancelled = false;
    let offMessage: (() => void) | undefined;
    let offTyping: (() => void) | undefined;

    const clearPeerTypingTimer = () => {
      if (peerTypingClearRef.current != null) {
        window.clearTimeout(peerTypingClearRef.current);
        peerTypingClearRef.current = null;
      }
    };

    const handleConnect = () => {
      if (!cancelled) setConnected(true);
    };
    const handleDisconnect = () => {
      joinedRef.current = false;
      if (!cancelled) {
        setConnected(false);
        setPeerTyping(false);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    if (socket.connected) {
      setConnected(true);
    }

    offMessage = onMessageNew(socket, (message) => {
      onMessageRef.current(message);
    });

    offTyping = onTyping(socket, (payload) => {
      if (payload.conversationId !== conversationId) return;
      if (
        selfUserIdRef.current &&
        payload.userId === selfUserIdRef.current
      ) {
        return;
      }
      setPeerTyping(true);
      clearPeerTypingTimer();
      peerTypingClearRef.current = window.setTimeout(() => {
        setPeerTyping(false);
        peerTypingClearRef.current = null;
      }, TYPING_CLEAR_MS);
    });

    void joinConversation(socket, conversationId).then((ack) => {
      if (cancelled) return;
      joinedRef.current = ack.ok;
    });

    return () => {
      cancelled = true;
      joinedRef.current = false;
      clearPeerTypingTimer();
      if (typingTimerRef.current != null) {
        window.clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      offMessage?.();
      offTyping?.();
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      disconnectChatSocket(socket);
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [enabled, conversationId]);

  const notifyTyping = useCallback(() => {
    if (!conversationId) return;
    if (typingTimerRef.current != null) {
      window.clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = window.setTimeout(() => {
      typingTimerRef.current = null;
      const socket = socketRef.current;
      if (!socket || !joinedRef.current) return;
      emitTyping(socket, conversationId);
    }, TYPING_DEBOUNCE_MS);
  }, [conversationId]);

  return { connected, peerTyping, notifyTyping };
}
