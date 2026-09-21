"use client";
import { useCallback, useSyncExternalStore } from "react";
const eventName = "pool-finance-preference";
function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener(eventName, callback);
    return () => { window.removeEventListener("storage", callback); window.removeEventListener(eventName, callback); };
}
export function useFinancialPreference(key: string, fallback: string) {
    const read = useCallback(() => {
        try {
            return localStorage.getItem(key) || fallback;
        }
        catch {
            return fallback;
        }
    }, [key, fallback]);
    const server = useCallback(() => fallback, [fallback]);
    const value = useSyncExternalStore(subscribe, read, server);
    const set = (next: string) => {
        try {
            localStorage.setItem(key, next);
            window.dispatchEvent(new Event(eventName));
        }
        catch { }
    };
    return [value, set] as const;
}
