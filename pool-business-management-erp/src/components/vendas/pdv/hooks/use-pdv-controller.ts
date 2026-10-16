"use client";
import { usePdvState } from "./use-pdv-state";
import { usePdvDerived } from "./use-pdv-derived";
import { usePdvCartActions } from "./use-pdv-cart-actions";
import { usePdvPaymentActions } from "./use-pdv-payment-actions";
export function usePdvController() {
  const state = usePdvState();
  const derived = usePdvDerived(state);
  const base = { ...state, ...derived };
  const actions = usePdvCartActions(base);
  const payment = usePdvPaymentActions({ ...base, ...actions });
  return { ...base, ...actions, ...payment };
}
