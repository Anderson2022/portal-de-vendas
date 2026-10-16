"use server";
import { api, BackendError } from "@/lib/backend/client";
import { revalidatePath } from "next/cache";
export async function saveAccountNature(id: string, natureId: string) {
  try {
    await api(
      `/financeiro/cadastros/plano-contas/${encodeURIComponent(id)}/natureza-padrao`,
      { method: "PUT", body: JSON.stringify({ natureId: natureId || null }) },
    );
  } catch (error) {
    if (error instanceof BackendError) return { error: error.message };
    throw error;
  }
  revalidatePath("/ajustes/financeiro/naturezas-financeiras");
  return { error: null };
}
