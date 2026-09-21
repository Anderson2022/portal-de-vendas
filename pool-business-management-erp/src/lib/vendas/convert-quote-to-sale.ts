"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { convertQuote } from "../backend/commercial";
import { todayISO } from "../commercial/domain";

const value = (fd: FormData, key: string) =>
  String(fd.get(key) ?? "").trim();

export async function convertQuoteToSale(fd: FormData) {
  const quoteId = value(fd, "quoteId");

  if (!quoteId) {
    throw new Error("Orçamento inválido.");
  }

  const saleId = await convertQuote(quoteId, {
    paymentMethod: "PIX",
    paid: false,
    dueDate: todayISO(),
  });

  revalidatePath("/vendas");
  revalidatePath("/vendas/orcamentos");
  revalidatePath("/vendas/pedidos");
  revalidatePath("/", "layout");

  redirect(`/vendas/pedidos/${saleId}`);
}