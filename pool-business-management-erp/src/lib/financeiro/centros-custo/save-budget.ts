"use server";
import { api, BackendError } from "@/lib/backend/client";
export async function saveCostCenterBudget(id: string, form: FormData) {
  try {
    await api(
      `/financeiro/cadastros/centros-custo/${encodeURIComponent(id)}/orcamento`,
      {
        method: "PUT",
        body: JSON.stringify({
          period: String(form.get("period")) + "-01",
          planned: Number(form.get("planned")),
          revised: form.get("revised") ? Number(form.get("revised")) : null,
          notes: String(form.get("notes") || ""),
        }),
      },
    );
    return { error: null };
  } catch (error) {
    if (error instanceof BackendError) return { error: error.message };
    throw error;
  }
}
