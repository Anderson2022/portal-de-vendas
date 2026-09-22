import { useMemo, useState } from "react";
import { today } from "@/lib/financeiro/dates";
import type {
  Allocation,
  PayableFormState,
  PayableTab,
} from "./payable-form-types";
import { buildInstallments } from "./payable-form-utils";

const initialState = (): PayableFormState => ({
  amount: 0,
  interest: 0,
  fine: 0,
  discount: 0,
  dueDate: today(),
  installmentsEnabled: false,
  installments: 2,
  intervalDays: 30,
  firstDueDate: today(),
  allocations: [],
});

export function usePayableForm() {
  const [tab, setTab] = useState<PayableTab>("title");
  const [state, setState] = useState(initialState);
  const netAmount = Math.max(
    0,
    state.amount + state.interest + state.fine - state.discount,
  );
  const installments = useMemo(
    () =>
      buildInstallments(
        netAmount,
        state.installmentsEnabled ? state.installments : 1,
        state.installmentsEnabled ? state.firstDueDate : state.dueDate,
        state.intervalDays,
      ),
    [netAmount, state],
  );
  const allocationTotal = state.allocations.reduce(
    (total, allocation) => total + allocation.percentage,
    0,
  );

  function update<K extends keyof PayableFormState>(
    key: K,
    value: PayableFormState[K],
  ) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function updateAllocation(id: string, patch: Partial<Allocation>) {
    update(
      "allocations",
      state.allocations.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    );
  }

  function reset() {
    setState(initialState());
    setTab("title");
  }

  return {
    tab,
    setTab,
    state,
    update,
    netAmount,
    installments,
    allocationTotal,
    updateAllocation,
    reset,
  };
}
