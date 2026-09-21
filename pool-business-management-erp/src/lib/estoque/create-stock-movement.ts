"use server";

import { revalidatePath } from "next/cache";
import { api } from "../backend/client";

const value = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

const numberValue = (fd: FormData, key: string) => {
  const raw = value(fd, key).replace(",", ".");
  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : 0;
};

const movementTypes: Record<string, string> = {
  ENTRADA: "ENTRY",
  SAIDA: "EXIT",
  AJUSTE: "ADJUSTMENT",
  RESERVA: "RESERVATION",
  LIBERACAO: "RELEASE",
};

export async function createStockMovement(fd: FormData) {
  const productId = value(fd, "productId");
  const warehouseId = value(fd, "warehouseId");
  const movementType = value(fd, "type");
  const quantity = numberValue(fd, "quantity");
  const unitCost = numberValue(fd, "unitCost");

  if (!productId) {
    throw new Error("Produto é obrigatório.");
  }

  if (quantity <= 0) {
    throw new Error("Quantidade deve ser maior que zero.");
  }

  const type = movementTypes[movementType];

  if (!type) {
    throw new Error("Tipo de movimentação inválido.");
  }

  await api("/inventory/movements", {
    method: "POST",
    body: JSON.stringify({
      productId,

      warehouseId: warehouseId || null,
      locationId: value(fd, "locationId") || null,

      type,

      quantity,

      unitCost,

      referenceType: "MANUAL",

      referenceId: value(fd, "referenceId") || null,

      notes: value(fd, "reason") || null,
    }),
  });

  revalidatePath("/estoque");
  revalidatePath("/estoque/produtos");
  revalidatePath("/estoque/movimentacoes");
}
