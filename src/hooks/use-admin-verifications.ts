"use client";

import { useCallback, useEffect, useState } from "react";

import { getErrorMessage } from "@/hooks/use-auth";
import * as adminVerificationsApi from "@/lib/api/admin-verifications";
import type { VerificationQueueItem } from "@/lib/api/types";

export function useAdminVerifications() {
  const [items, setItems] = useState<VerificationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const reload = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const next = await adminVerificationsApi.listAdminVerifications(
        "pending",
        signal
      );
      if (signal?.aborted) return;
      setItems(next);
    } catch (err) {
      if (signal?.aborted) return;
      setError(getErrorMessage(err, "Could not load verification queue"));
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

  const openDocument = useCallback(async (id: string) => {
    const { documentUrl } = await adminVerificationsApi.getAdminDocumentUrl(id);
    return documentUrl;
  }, []);

  const approve = useCallback(
    async (id: string) => {
      setReviewingId(id);
      try {
        await adminVerificationsApi.approveVerification(id);
        setItems((current) => current.filter((item) => item.id !== id));
        await reload();
      } finally {
        setReviewingId(null);
      }
    },
    [reload]
  );

  const reject = useCallback(
    async (id: string, reason?: string) => {
      setReviewingId(id);
      try {
        await adminVerificationsApi.rejectVerification(id, reason);
        setItems((current) => current.filter((item) => item.id !== id));
        await reload();
      } finally {
        setReviewingId(null);
      }
    },
    [reload]
  );

  return {
    items,
    loading,
    error,
    reload,
    openDocument,
    approve,
    reject,
    reviewingId,
  };
}
