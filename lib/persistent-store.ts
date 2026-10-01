"use client";

import { useSyncExternalStore } from "react";

type Listener = () => void;
type StorageKind = "local" | "session";

export interface PersistentStore<T> {
  get: () => T;
  set: (updater: (prev: T) => T) => void;
  subscribe: (listener: Listener) => () => void;
  /** Value used during SSR and hydration so markup always matches. */
  serverValue: T;
}

/**
 * A tiny external store backed by localStorage / sessionStorage.
 * Components read it with `useStore`, which is built on useSyncExternalStore,
 * so the server render uses the seed value and the client switches to the
 * persisted value right after hydration without a mismatch.
 */
export function createPersistentStore<T>(
  key: string,
  initial: T,
  kind: StorageKind = "local",
): PersistentStore<T> {
  let state: T = initial;
  let loaded = false;
  const listeners = new Set<Listener>();

  const storage = () => {
    try {
      return kind === "local" ? window.localStorage : window.sessionStorage;
    } catch {
      return null; // private mode / blocked storage
    }
  };

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = storage()?.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      /* ignore corrupt or unavailable storage */
    }
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key !== key) return;
    try {
      state = event.newValue ? (JSON.parse(event.newValue) as T) : initial;
    } catch {
      state = initial;
    }
    listeners.forEach((l) => l());
  };

  return {
    serverValue: initial,
    get() {
      load();
      return state;
    },
    set(updater) {
      load();
      state = updater(state);
      try {
        storage()?.setItem(key, JSON.stringify(state));
      } catch {
        /* quota exceeded or storage blocked: keep in-memory state */
      }
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1 && kind === "local") {
        window.addEventListener("storage", onStorage); // sync between tabs
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
  };
}

export function useStore<T>(store: PersistentStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, () => store.serverValue);
}
