"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  BILLING_STORAGE_KEY,
  DEFAULT_BILLING_MODEL,
  sanitizeBillingModel,
  type BillingModel,
} from "@/lib/billing";

let cached: BillingModel | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): BillingModel {
  try {
    const raw = localStorage.getItem(BILLING_STORAGE_KEY);
    if (raw) {
      return sanitizeBillingModel(JSON.parse(raw) as Partial<BillingModel>);
    }
  } catch {
    // Ignore corrupt storage and reset to default model.
  }
  return DEFAULT_BILLING_MODEL;
}

function getClientSnapshot(): BillingModel {
  if (cached === null) cached = readFromStorage();
  return cached;
}

function getServerSnapshot(): BillingModel {
  return DEFAULT_BILLING_MODEL;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function write(next: BillingModel) {
  cached = next;
  try {
    localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage issues for MVP.
  }
  emit();
}

export function useBilling() {
  const model = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const updateModel = useCallback((patch: Partial<BillingModel>) => {
    write(
      sanitizeBillingModel({
        ...getClientSnapshot(),
        ...patch,
        updatedAt: Date.now(),
      }),
    );
  }, []);

  const resetModel = useCallback(() => {
    write({ ...DEFAULT_BILLING_MODEL, updatedAt: Date.now() });
  }, []);

  return {
    model,
    hydrated,
    updateModel,
    resetModel,
  };
}
