"use client";

import { useCallback, useEffect, useState } from "react";

import * as conversationsApi from "@/lib/api/conversations";
import type {
  Conversation,
  ConversationListItem,
  CreateConversationInput,
} from "@/lib/api/types";
import { getErrorMessage } from "@/hooks/use-auth";

export function useConversations() {
  const [items, setItems] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const next = await conversationsApi.listConversations(signal);
      if (signal?.aborted) return;
      setItems(next);
    } catch (err) {
      if (signal?.aborted) return;
      setError(getErrorMessage(err, "Could not load conversations"));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void reload(controller.signal);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [reload]);

  const create = useCallback(
    async (input: CreateConversationInput): Promise<Conversation> => {
      const created = await conversationsApi.createConversation(input);
      await reload();
      return created;
    },
    [reload]
  );

  return { items, loading, error, reload, create };
}
