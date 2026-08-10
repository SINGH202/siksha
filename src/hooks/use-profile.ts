"use client";

import { useCallback, useEffect, useState } from "react";

import * as profilesApi from "@/lib/api/profiles";
import type {
  ProfileMeResponse,
  UpdateParentProfileInput,
  UpdateTeacherProfileInput,
} from "@/lib/api/types";
import { isParentProfileMe, isTeacherProfileMe } from "@/lib/api/types";
import { getErrorMessage } from "@/hooks/use-auth";

export function useProfile() {
  const [data, setData] = useState<ProfileMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const next = await profilesApi.getMyProfile(signal);
      if (signal?.aborted) return null;
      setData(next);
      return next;
    } catch (err) {
      if (signal?.aborted) return null;
      const message = getErrorMessage(err, "Could not load profile");
      setError(message);
      throw err;
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void reload(controller.signal).catch(() => {
        /* error state set in reload */
      });
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [reload]);

  const saveParent = useCallback(async (input: UpdateParentProfileInput) => {
    const result = await profilesApi.updateParentProfile(input);
    setData((current) => {
      if (!current || !isParentProfileMe(current)) return current;
      return {
        user: current.user,
        profile: result.profile,
        isComplete: result.isComplete,
      };
    });
    return result;
  }, []);

  const saveTeacher = useCallback(async (input: UpdateTeacherProfileInput) => {
    const result = await profilesApi.updateTeacherProfile(input);
    setData((current) => {
      if (!current || !isTeacherProfileMe(current)) return current;
      return {
        user: current.user,
        profile: result.profile,
        isComplete: result.isComplete,
      };
    });
    return result;
  }, []);

  return {
    data,
    loading,
    error,
    reload,
    saveParent,
    saveTeacher,
    isComplete: data?.isComplete ?? false,
  };
}
