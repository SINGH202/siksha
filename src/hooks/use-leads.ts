"use client";

import { useCallback, useEffect, useState } from "react";

import * as applicationsApi from "@/lib/api/applications";
import type {
  CreateApplicationInput,
  Requirement,
} from "@/lib/api/types";
import { getErrorMessage } from "@/hooks/use-auth";

export function useLeads() {
  const [items, setItems] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const next = await applicationsApi.getLeads(signal);
      if (signal?.aborted) return;
      setItems(next);
    } catch (err) {
      if (signal?.aborted) return;
      setError(getErrorMessage(err, "Could not load leads"));
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

  const apply = useCallback(
    async (requirementId: string, input: CreateApplicationInput) => {
      const application = await applicationsApi.applyToRequirement(
        requirementId,
        input
      );
      setItems((current) => current.filter((item) => item.id !== requirementId));
      return application;
    },
    []
  );

  return { items, loading, error, reload, apply };
}
