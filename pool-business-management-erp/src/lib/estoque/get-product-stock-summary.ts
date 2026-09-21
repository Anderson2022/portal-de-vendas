"use server";

import { api } from "../backend/client";

export type ProductStockSummary = {
  physical: number;
  reserved: number;
  available: number;
};

export async function getProductStockSummary(productId: string) {
  return api<ProductStockSummary>(`/inventory/${productId}`);
}
