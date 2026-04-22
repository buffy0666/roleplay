"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  PLAYBOOK_STORAGE_KEY,
  SAMPLE_PLAYBOOK,
  createEntry,
  type PlaybookEntry,
} from "@/lib/playbook";

// Module-level store so every consumer of the hook shares the same state.

let cached: PlaybookEntry[] | null = null;
const listeners = new Set<() => void>();
const EMPTY: readonly PlaybookEntry[] = Object.freeze([]);

function readFromStorage(): PlaybookEntry[] {
  try {
    const raw = localStorage.getItem(PLAYBOOK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as PlaybookEntry[];
    }
  } catch {
    // Corrupt storage — treat as empty
  }
  return [];
}

function getClientSnapshot(): PlaybookEntry[] {
  if (cached === null) cached = readFromStorage();
  return cached;
}

function getServerSnapshot(): readonly PlaybookEntry[] {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

function write(next: PlaybookEntry[]) {
  cached = next;
  try {
    localStorage.setItem(PLAYBOOK_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or disabled storage — ignore
  }
  emit();
}

export type UsePlaybook = ReturnType<typeof usePlaybook>;

export function usePlaybook() {
  const entries = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  ) as PlaybookEntry[];

  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const addEntry = useCallback(
    (partial: Partial<PlaybookEntry> = {}) => {
      const entry = createEntry(partial);
      write([entry, ...getClientSnapshot()]);
      return entry;
    },
    [],
  );

  const updateEntry = useCallback(
    (id: string, patch: Partial<PlaybookEntry>) => {
      const next = getClientSnapshot().map((e) =>
        e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e,
      );
      write(next);
    },
    [],
  );

  const removeEntry = useCallback((id: string) => {
    write(getClientSnapshot().filter((e) => e.id !== id));
  }, []);

  const moveEntry = useCallback((id: string, direction: -1 | 1) => {
    const current = getClientSnapshot();
    const idx = current.findIndex((e) => e.id === id);
    if (idx < 0) return;
    const target = idx + direction;
    if (target < 0 || target >= current.length) return;
    const next = [...current];
    const [item] = next.splice(idx, 1);
    next.splice(target, 0, item);
    write(next);
  }, []);

  const loadSamples = useCallback(() => {
    const seeded = SAMPLE_PLAYBOOK.map((s) => createEntry(s));
    write(seeded);
  }, []);

  const clearAll = useCallback(() => {
    write([]);
  }, []);

  return {
    entries,
    hydrated,
    addEntry,
    updateEntry,
    removeEntry,
    moveEntry,
    loadSamples,
    clearAll,
  };
}
