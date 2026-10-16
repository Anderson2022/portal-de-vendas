"use server";
import { revalidatePath } from "next/cache";
import { api, BackendError } from "@/lib/backend/client";
import type { ChartAccountUpdate } from "./types";
export async function updateChartAccount(id: string, data: ChartAccountUpdate) {
  try {
    await api(`/financeiro/cadastros/plano-contas/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch (error) {
    if (error instanceof BackendError) return { error: error.message };
    throw error;
  }
  revalidatePath("/ajustes/financeiro/categoria-plano-contas");
  revalidatePath(`/ajustes/financeiro/categoria-plano-contas/${id}`);
  return { error: null };
}
