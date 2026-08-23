"use client";

import { useCallback, useEffect, useState } from "react";

import { getErrorMessage } from "@/hooks/use-auth";
import * as verificationApi from "@/lib/api/verification";
import type { VerificationMe } from "@/lib/api/types";
import { uploadTeacherFile } from "@/lib/uploads/put-to-r2";

export function useVerificationMe() {
  const [data, setData] = useState<VerificationMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reload = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const next = await verificationApi.getVerificationMe(signal);
      if (signal?.aborted) return;
      setData(next);
    } catch (err) {
      if (signal?.aborted) return;
      setError(getErrorMessage(err, "Could not load verification status"));
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

  const submitId = useCallback(
    async (file: File) => {
      setSubmitting(true);
      try {
        const { objectKey } = await uploadTeacherFile("teacher_id", file);
        await verificationApi.submitVerification(objectKey);
        await reload();
      } finally {
        setSubmitting(false);
      }
    },
    [reload]
  );

  return { data, loading, error, reload, submitId, submitting };
}
