"use client";
import { usePdvController } from "./use-pdv-controller";
import { useEffectEvent, useEffect } from "react";
import { isMode } from "../utils/is-mode";
export function usePdvKeyboard(
  controller: ReturnType<typeof usePdvController>,
) {
  const { setModal, scannerRef, page, startPayment, modal, confirmPayment } =
    controller;
  const keyboard = useEffectEvent((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
    if (e.key === "Escape") {
      setModal(null);
      return;
    }
    if (e.key === "F1") {
      e.preventDefault();
      setModal("shortcuts");
    }
    if (e.key === "F2") {
      e.preventDefault();
      scannerRef.current?.focus();
    }
    if (e.key === "F3" && !typing) {
      e.preventDefault();
      if (page !== "home" && isMode(page)) startPayment();
    }
    if (e.key === "F8" && !typing) {
      e.preventDefault();
      if (page !== "home") startPayment();
    }
    if (e.key === "F9" && modal === "payment") {
      e.preventDefault();
      confirmPayment();
    }
    if (e.key === "Enter" && modal === "payment" && !typing) confirmPayment();
  });
  useEffect(() => {
    const listener = (event: KeyboardEvent) => keyboard(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
}
