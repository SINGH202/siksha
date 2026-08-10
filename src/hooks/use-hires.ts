"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api/client";
import * as hiresApi from "@/lib/api/hires";
import * as reviewsApi from "@/lib/api/reviews";
import type {
  CreateReviewInput,
  Hire,
  HireListItem,
  Review,
} from "@/lib/api/types";
import { getErrorMessage } from "@/hooks/use-auth";

export type ReviewResult = Review | { alreadyReviewed: true };

function toListItem(
  hire: Hire,
  existing?: HireListItem | null
): HireListItem {
  return {
    id: hire.id,
    conversationId: hire.conversationId,
    requirementId: hire.requirementId,
    requirementTitle: existing?.requirementTitle ?? "",
    parentId: hire.parentId,
    teacherId: hire.teacherId,
    peerName: existing?.peerName ?? null,
    createdAt: hire.createdAt,
  };
}

function upsertHire(
  current: HireListItem[],
  hire: Hire
): HireListItem[] {
  const idx = current.findIndex(
    (item) =>
      item.id === hire.id || item.conversationId === hire.conversationId
  );
  const nextItem = toListItem(hire, idx >= 0 ? current[idx] : null);
  if (idx >= 0) {
    const next = [...current];
    next[idx] = nextItem;
    return next;
  }
  return [nextItem, ...current];
}

export function useHires() {
  const [items, setItems] = useState<HireListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const next = await hiresApi.listMyHires(signal);
      if (signal?.aborted) return;
      setItems(next);
    } catch (err) {
      if (signal?.aborted) return;
      setError(getErrorMessage(err, "Could not load hires"));
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

  const hire = useCallback(async (conversationId: string): Promise<Hire> => {
    const created = await hiresApi.createHire({ conversationId });
    setItems((current) => upsertHire(current, created));
    return created;
  }, []);

  const review = useCallback(
    async (input: CreateReviewInput): Promise<ReviewResult> => {
      try {
        return await reviewsApi.createReview(input);
      } catch (err) {
        if (err instanceof ApiError && err.statusCode === 409) {
          return { alreadyReviewed: true };
        }
        throw err;
      }
    },
    []
  );

  return { items, loading, error, reload, hire, review };
}
