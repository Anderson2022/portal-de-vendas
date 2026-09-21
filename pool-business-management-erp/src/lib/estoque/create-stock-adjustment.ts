"use server";

import { revalidatePath } from "next/cache";
import { api } from "../backend/client";

export type StockAdjustmentInput = {
  productId: string;
  warehouseId: string;
  locationId?: string;
  effect: "ENTRY" | "EXIT";
  quantity: number;
  reason: string;
  document?: string;
  notes?: string;
};

export async function createStockAdjustment(input: StockAdjustmentInput) {
  if (!input.productId || !input.warehouseId) throw new Error("Informe o produto e o depósito.");
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) throw new Error("Informe uma quantidade maior que zero.");
  if (!input.reason.trim()) throw new Error("Informe o motivo do ajuste.");

  const signedQuantity = input.effect === "EXIT" ? -Math.abs(input.quantity) : Math.abs(input.quantity);
  const details = [
    `Motivo: ${input.reason.trim()}`,
    input.document?.trim() ? `Documento: ${input.document.trim()}` : "",
    input.notes?.trim() || "",
  ].filter(Boolean).join(" | ");

  await api("/inventory/movements", {
    method: "POST",
    body: JSON.stringify({
      productId: input.productId,
      warehouseId: input.warehouseId,
      locationId: input.locationId || null,
      type: "ADJUSTMENT",
      quantity: signedQuantity,
      unitCost: 0,
      referenceType: "STOCK_ADJUSTMENT",
      referenceId: null,
      notes: details,
    }),
  });

  revalidatePath("/estoque");
  revalidatePath("/relatorios/estoque/dashboard");
}
