"use client";

import { useCallback, useEffect, useState } from "react";

import * as applicationsApi from "@/lib/api/applications";
import * as requirementsApi from "@/lib/api/requirements";
import type {
  CreateRequirementInput,
  Requirement,
  RequirementApplication,
  UpdateRequirementInput,
} from "@/lib/api/types";
import { getErrorMessage } from "@/hooks/use-auth";

export function useMyRequirements() {
  const [items, setItems] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const next = await requirementsApi.getMyRequirements(signal);
      if (signal?.aborted) return;
      setItems(next);
    } catch (err) {
      if (signal?.aborted) return;
      setError(getErrorMessage(err, "Could not load requirements"));
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

  const create = useCallback(async (input: CreateRequirementInput) => {
    const created = await requirementsApi.createRequirement(input);
    setItems((current) => [created, ...current]);
    return created;
  }, []);

  const update = useCallback(async (id: string, input: UpdateRequirementInput) => {
    const updated = await requirementsApi.updateRequirement(id, input);
    setItems((current) =>
      current.map((item) => (item.id === id ? updated : item))
    );
    return updated;
  }, []);

  return { items, loading, error, reload, create, update };
}

export function useRequirementDetail(id: string) {
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [applications, setApplications] = useState<RequirementApplication[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const req = await requirementsApi.getRequirement(id, signal);
        if (signal?.aborted) return;
        setRequirement(req);
        try {
          const apps = await applicationsApi.getRequirementApplications(
            id,
            signal
          );
          if (!signal?.aborted) setApplications(apps);
        } catch {
          if (!signal?.aborted) setApplications([]);
        }
      } catch (err) {
        if (signal?.aborted) return;
        setRequirement(null);
        setError(getErrorMessage(err, "Could not load requirement"));
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [id]
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

  return { requirement, applications, loading, error, reload };
}
