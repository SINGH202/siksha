"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import * as conversationsApi from "@/lib/api/conversations";
import type { ChatMessage } from "@/lib/api/types";
import { getErrorMessage } from "@/hooks/use-auth";

const POLL_INTERVAL_MS = 15_000;

function upsertById(
  current: ChatMessage[],
  incoming: ChatMessage | ChatMessage[]
): ChatMessage[] {
  const batch = Array.isArray(incoming) ? incoming : [incoming];
  if (batch.length === 0) return current;

  const byId = new Map(current.map((m) => [m.id, m]));
  for (const msg of batch) {
    byId.set(msg.id, msg);
  }

  return Array.from(byId.values()).sort((a, b) =>
    a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0
  );
}

export type UseConversationMessagesOptions = {
  pollWhenDisconnected?: boolean;
};

export function useConversationMessages(
  conversationId: string,
  options?: UseConversationMessagesOptions
) {
  const pollWhenDisconnected = options?.pollWhenDisconnected === true;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const loadingEarlierRef = useRef(false);

  const reload = useCallback(
    async (signal?: AbortSignal) => {
      if (!conversationId) return;
      setLoading(true);
      setError(null);
      try {
        const page = await conversationsApi.listMessages(
          conversationId,
          undefined,
          signal
        );
        if (signal?.aborted) return;
        setMessages(page.messages);
        setNextCursor(page.nextCursor);
      } catch (err) {
        if (signal?.aborted) return;
        setError(getErrorMessage(err, "Could not load messages"));
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [conversationId]
  );

  useEffect(() => {
    setMessages([]);
    setNextCursor(null);
    setError(null);

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void reload(controller.signal);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [reload]);

  const mergeMessage = useCallback((msg: ChatMessage) => {
    setMessages((current) => upsertById(current, msg));
  }, []);

  const send = useCallback(
    async (body: string) => {
      if (!conversationId) {
        throw new Error("No conversation selected");
      }
      const sent = await conversationsApi.sendMessage(conversationId, body);
      setMessages((current) => upsertById(current, sent));
      return sent;
    },
    [conversationId]
  );

  const loadEarlier = useCallback(async () => {
    if (!conversationId || !nextCursor || loadingEarlierRef.current) return;
    loadingEarlierRef.current = true;
    try {
      const page = await conversationsApi.listMessages(conversationId, {
        cursor: nextCursor,
      });
      setMessages((current) => upsertById(current, page.messages));
      setNextCursor(page.nextCursor);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load earlier messages"));
    } finally {
      loadingEarlierRef.current = false;
    }
  }, [conversationId, nextCursor]);

  useEffect(() => {
    if (!conversationId || !pollWhenDisconnected) return;

    let intervalId: number | null = null;
    const controller = new AbortController();

    const poll = () => {
      if (document.visibilityState !== "visible") return;
      void conversationsApi
        .listMessages(conversationId, undefined, controller.signal)
        .then((page) => {
          if (controller.signal.aborted) return;
          setMessages((current) => upsertById(current, page.messages));
        })
        .catch(() => {
          /* silent poll failure; REST + socket remain source of truth */
        });
    };

    const start = () => {
      if (intervalId != null) return;
      if (document.visibilityState !== "visible") return;
      intervalId = window.setInterval(poll, POLL_INTERVAL_MS);
    };

    const stop = () => {
      if (intervalId == null) return;
      window.clearInterval(intervalId);
      intervalId = null;
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      controller.abort();
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [conversationId, pollWhenDisconnected]);

  return {
    messages,
    loading,
    error,
    nextCursor,
    loadEarlier,
    send,
    mergeMessage,
    reload,
  };
}
