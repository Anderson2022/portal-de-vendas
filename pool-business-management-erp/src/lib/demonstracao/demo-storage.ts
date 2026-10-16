import { createDemoState } from "./create-demo-state";
import type { DemoState } from "./types/demo-state";

const TAB_KEY = "poolcontrol.demo.tab";
const PREFIX = "poolcontrol.demo.data.";
const LIFETIME = 2 * 60 * 60 * 1000;

export function clearDemoSession() {
  const id = sessionStorage.getItem(TAB_KEY);
  if (id) localStorage.removeItem(PREFIX + id);
  sessionStorage.removeItem(TAB_KEY);
}

export function startDemoSession() {
  clearDemoSession();
  const id = crypto.randomUUID();
  sessionStorage.setItem(TAB_KEY, id);
  try {
    persistDemoState(createDemoState());
  } catch (error) {
    sessionStorage.removeItem(TAB_KEY);
    throw error;
  }
}

export function persistDemoState(state: DemoState) {
  const id = sessionStorage.getItem(TAB_KEY);
  if (!id) throw new Error("Sessão de demonstração encerrada.");
  localStorage.setItem(
    PREFIX + id,
    JSON.stringify({ state, expiresAt: Date.now() + LIFETIME }),
  );
}

export function getDemoSnapshot(): string | null {
  try {
    const id = sessionStorage.getItem(TAB_KEY);
    return id ? localStorage.getItem(PREFIX + id) : null;
  } catch {
    return null;
  }
}

export function loadDemoState(snapshot = getDemoSnapshot()): DemoState | null {
  const value = snapshot;
  if (!value) return null;
  try {
    const { state, expiresAt } = JSON.parse(value);
    if (typeof expiresAt !== "number" || expiresAt <= Date.now()) return null;
    if (
      !state ||
      !["clients", "products", "sales", "payables"].every((key) =>
        Array.isArray(state[key]),
      )
    )
      return null;
    return state as DemoState;
  } catch {
    return null;
  }
}
