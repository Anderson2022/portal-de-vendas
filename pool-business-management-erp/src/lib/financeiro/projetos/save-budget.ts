"use server";
import { api, BackendError } from "@/lib/backend/client";
export async function saveProjectBudget(id: string, form: FormData) {
  try {
    await api(
      `/financeiro/cadastros/projetos/${encodeURIComponent(id)}/orcamento`,
      {
        method: "PUT",
        body: JSON.stringify({
          chartAccountId: String(form.get("chartAccountId")),
          costCenterId: String(form.get("costCenterId")),
          planned: Number(form.get("planned")),
        }),
      },
    );
    return { error: null };
  } catch (error) {
    if (error instanceof BackendError) return { error: error.message };
    throw error;
  }
}
