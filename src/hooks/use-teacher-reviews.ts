"use client";

import { useCallback, useEffect, useState } from "react";

import { getErrorMessage } from "@/hooks/use-auth";
import * as reviewsApi from "@/lib/api/reviews";
import type { TeacherReviewListItem } from "@/lib/api/types";

export function useTeacherReviews(teacherId: string | null | undefined) {
  const [items, setItems] = useState<TeacherReviewListItem[]>([]);
  const [loading, setLoading] = useState(Boolean(teacherId));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    async (signal?: AbortSignal) => {
      if (!teacherId) {
        setItems([]);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const next = await reviewsApi.listTeacherReviews(teacherId, signal);
        if (signal?.aborted) return;
        setItems(next);
      } catch (err) {
        if (signal?.aborted) return;
        setError(getErrorMessage(err, "Could not load reviews"));
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [teacherId]
  );

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

  return { items, loading, error, reload };
}
