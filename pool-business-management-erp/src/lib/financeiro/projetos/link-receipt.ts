"use server";
import { api, BackendError } from "@/lib/backend/client";
export async function linkProjectReceipt(id: string, receivableId: string) {
  try {
    await api(
      `/financeiro/cadastros/projetos/${encodeURIComponent(id)}/receitas`,
      { method: "PUT", body: JSON.stringify({ receivableId }) },
    );
    return { error: null };
  } catch (error) {
    if (error instanceof BackendError) return { error: error.message };
    throw error;
  }
}
