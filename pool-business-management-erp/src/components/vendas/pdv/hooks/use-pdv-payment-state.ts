"use client";
import { useState } from "react";
import type { PayMethod } from "../types/pay-method";
export function usePdvPaymentState() {
  const [method, setMethod] = useState<PayMethod>("Dinheiro");
  const [received, setReceived] = useState("30,00");
  const [discount, setDiscount] = useState(0);
  const [discountInput, setDiscountInput] = useState("0");
  const [split, setSplit] = useState(false);
  const [payCardSaved, setPayCardSaved] = useState(true);
  const [useCredit, setUseCredit] = useState(false);
  const [printing, setPrinting] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);
  return {
    method,
    setMethod,
    received,
    setReceived,
    discount,
    setDiscount,
    discountInput,
    setDiscountInput,
    split,
    setSplit,
    payCardSaved,
    setPayCardSaved,
    useCredit,
    setUseCredit,
    printing,
    setPrinting,
    whatsapp,
    setWhatsapp,
  };
}
