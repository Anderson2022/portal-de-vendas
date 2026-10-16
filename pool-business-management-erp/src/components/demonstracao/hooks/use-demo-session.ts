"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  clearDemoSession,
  getDemoSnapshot,
  startDemoSession,
  loadDemoState,
  persistDemoState,
} from "@/lib/demonstracao/demo-storage";
import { createDemoState } from "@/lib/demonstracao/create-demo-state";
import type { DemoState } from "@/lib/demonstracao/types/demo-state";

function subscribe(listener: () => void) {
  window.addEventListener("poolcontrol-demo-change", listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("poolcontrol-demo-change", listener);
    window.removeEventListener("storage", listener);
  };
}

export function useDemoSession(autoStart = false) {
  const snapshot = useSyncExternalStore(subscribe, getDemoSnapshot, () => null);
  const state = useMemo(() => loadDemoState(snapshot), [snapshot]);
  const [error, setError] = useState("");

  const exit = useCallback(() => {
    try {
      clearDemoSession();
    } finally {
      window.location.replace("/login");
    }
  }, []);

  useEffect(() => {
    try {
      const stored = loadDemoState();
      if (!stored && autoStart) {
        startDemoSession();
        window.dispatchEvent(new Event("poolcontrol-demo-change"));
      } else if (!stored) {
        exit();
        return;
      }
      if (autoStart) window.history.replaceState(null, "", "/demonstracao");
    } catch {
      exit();
      return;
    }
    const leave = () => {
      try {
        clearDemoSession();
      } catch {
        /* Storage may be disabled after login. */
      }
    };
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) exit();
    };
    window.addEventListener("pagehide", leave);
    window.addEventListener("pageshow", restore);
    return () => {
      window.removeEventListener("pagehide", leave);
      window.removeEventListener("pageshow", restore);
    };
  }, [exit, autoStart]);

  function update(transform: (current: DemoState) => DemoState) {
    if (!state) return false;
    try {
      const next = transform(state);
      persistDemoState(next);
      window.dispatchEvent(new Event("poolcontrol-demo-change"));
      setError("");
      return true;
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível salvar no navegador.",
      );
      return false;
    }
  }

  return { state, error, update, exit, reset: () => update(createDemoState) };
}
