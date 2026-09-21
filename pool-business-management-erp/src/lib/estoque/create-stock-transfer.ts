"use server";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/backend/client";
export type TransferItem = {
  productId: string;
  unitId: string;
  quantity: string;
  originLocationId?: string;
  destinationLocationId?: string;
  lot?: string;
  expiration?: string;
  serialNumber?: string;
  notes?: string;
};
export async function createStockTransfer(input: {
  originWarehouseId: string;
  destinationWarehouseId: string;
  reason: string;
  notes: string;
  requestNow: boolean;
  items: TransferItem[];
}) {
  const result = await api<{ id: number; number: string; status: string }>(
    "/inventory/transfers",
    { method: "POST", body: JSON.stringify(input) },
  );
  revalidatePath("/estoque");
  return result;
}
export async function getTransferReasons() {
  return api<Array<{ code: string; name: string }>>(
    "/inventory/transfers/reasons",
  );
}
export async function createTransferReason(code: string, name: string) {
  return api<{ id: number; code: string; name: string }>(
    "/inventory/transfers/reasons",
    { method: "POST", body: JSON.stringify({ code, name }) },
  );
}
export async function createTransferLocation(
  warehouseId: string,
  code: string,
  name: string,
) {
  return api<{ id: number; codigo: string; name: string }>(
    "/inventory/transfers/locations",
    { method: "POST", body: JSON.stringify({ warehouseId, code, name }) },
  );
}
export async function getTransferProductInfo(
  productId: string,
  warehouseId: string,
) {
  return api<{
    available: number;
    product: {
      controla_lote: boolean;
      controla_validade: boolean;
      controla_serie: boolean;
    };
    conversions: Array<{
      unit_id: number;
      name: string;
      sigla: string;
      factor: number;
      unidade_base: boolean;
    }>;
  }>(
    `/inventory/transfers/product-info?productId=${productId}&warehouseId=${warehouseId}`,
  );
}
export async function getTransferProductOrigin(productId: string) {
  return api<{ warehouse_id: number | null; location_id: number | null }>(
    `/inventory/transfers/product-origin?productId=${productId}`,
  );
}
