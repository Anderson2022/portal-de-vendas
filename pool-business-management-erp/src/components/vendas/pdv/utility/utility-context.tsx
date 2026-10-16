import { createContext, useContext } from "react";
import { useUtilityState } from "./use-utility-state";
import type { UtilityProps } from "./utility-props";
import type { ReactNode } from "react";
const UtilityContext = createContext<ReturnType<typeof useUtilityState> | null>(
  null,
);
export function UtilityProvider({
  children,
  ...props
}: UtilityProps & { children: ReactNode }) {
  const state = useUtilityState(props);
  return (
    <UtilityContext.Provider value={state}>{children}</UtilityContext.Provider>
  );
}
export function useUtility() {
  const value = useContext(UtilityContext);
  if (!value) throw new Error("Utilitário fora do contexto");
  return value;
}
