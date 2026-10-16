"use client";
import { createContext, useContext } from "react";
import { usePdvController } from "./hooks/use-pdv-controller";
import type { ReactNode } from "react";
import { usePdvKeyboard } from "./hooks/use-pdv-keyboard";
const PdvContext = createContext<ReturnType<typeof usePdvController> | null>(
  null,
);
export function PdvProvider({ children }: { children: ReactNode }) {
  const controller = usePdvController();
  usePdvKeyboard(controller);
  return (
    <PdvContext.Provider value={controller}>{children}</PdvContext.Provider>
  );
}
export function usePdv() {
  const value = useContext(PdvContext);
  if (!value) throw new Error("PDV fora do contexto");
  return value;
}
