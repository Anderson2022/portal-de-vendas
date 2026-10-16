"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  ChartLookups,
  LookupOption,
} from "@/lib/financeiro/plano-contas/lookup-types";
import type { ChartAccountDetail } from "@/lib/financeiro/plano-contas/types";
import { initialLookupValues } from "@/lib/financeiro/plano-contas/initial-lookup-values";
type LookupContext = {
  lookups: ChartLookups;
  selected: Record<string, string>;
  accountId?: string;
  code: string;
  setCode: (value: string) => void;
  select: (key: string, id: string) => void;
  add: (key: string, option: LookupOption) => void;
};
const Context = createContext<LookupContext | null>(null);
export function ChartLookupProvider({
  lookups: initial,
  account,
  children,
}: {
  lookups: ChartLookups;
  account?: ChartAccountDetail;
  children: ReactNode;
}) {
  const [lookups, setLookups] = useState(initial);
  const [selected, setSelected] = useState(() =>
    initialLookupValues(account, initial),
  );
  const [code, setCode] = useState(account?.code ?? "");
  function select(key: string, id: string) {
    setSelected((current) => {
      const next = { ...current, [key]: id };
      for (const [child, group] of Object.entries(lookups)) {
        if (group.parentKey === key && id !== current[key]) next[child] = "";
      }
      return next;
    });
  }
  function add(key: string, option: LookupOption) {
    setLookups((current) => ({
      ...current,
      [key]: { ...current[key], options: [...current[key].options, option] },
    }));
    select(key, option.id);
  }
  return (
    <Context.Provider
      value={{
        lookups,
        selected,
        select,
        add,
        accountId: account?.id,
        code,
        setCode,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useChartLookups() {
  const value = useContext(Context);
  if (!value) throw new Error("Campo fora do formulário de plano de contas.");
  return value;
}
