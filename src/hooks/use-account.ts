"use client";

import { useCallback, useEffect, useState } from "react";

import {
  defaultParentProfile,
  defaultSettings,
  defaultTeacherProfile,
  type ParentProfile,
  type TeacherProfile,
  type UserSettings,
} from "@/lib/account-defaults";

const PARENT_KEY = "siksha.parent.profile";
const TEACHER_KEY = "siksha.teacher.profile";
const PARENT_SETTINGS_KEY = "siksha.parent.settings";
const TEACHER_SETTINGS_KEY = "siksha.teacher.settings";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue(readJson(key, fallback));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per key
  }, [key]);

  const save = useCallback(
    (next: T | ((current: T) => T)) => {
      setValue((current) => {
        const resolved = typeof next === "function" ? (next as (c: T) => T)(current) : next;
        writeJson(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return { value, save, ready };
}

export function useParentProfile() {
  return usePersistentState<ParentProfile>(PARENT_KEY, defaultParentProfile);
}

export function useTeacherProfile() {
  return usePersistentState<TeacherProfile>(TEACHER_KEY, defaultTeacherProfile);
}

export function useParentSettings() {
  return usePersistentState<UserSettings>(PARENT_SETTINGS_KEY, defaultSettings);
}

export function useTeacherSettings() {
  return usePersistentState<UserSettings>(TEACHER_SETTINGS_KEY, defaultSettings);
}

export function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
