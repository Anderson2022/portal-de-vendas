"use server";
import { revalidatePath } from "next/cache";
import { api, BackendError } from "@/lib/backend/client";

export async function deleteChartAccount(id: string) {
  try {
    await api(`/financeiro/cadastros/plano-contas/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (error) {
    if (error instanceof BackendError) return { error: error.message };
    throw error;
  }
  revalidatePath("/ajustes/financeiro/categoria-plano-contas");
  revalidatePath(`/ajustes/financeiro/categoria-plano-contas/${id}`);
  return { error: null };
}
