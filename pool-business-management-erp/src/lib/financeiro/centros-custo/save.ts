"use server";
import { revalidatePath } from "next/cache";
import { api, BackendError } from "@/lib/backend/client";
export async function saveCostCenter(id: string | null, form: FormData) {
  const data = {
    code: String(form.get("code") || "").trim(),
    name: String(form.get("name") || "").trim(),
    description: String(form.get("description") || "").trim() || null,
    parentId: String(form.get("parentId") || "").trim() || null,
    type: String(form.get("type") || "").trim(),
    responsibleId: String(form.get("responsibleId") || "").trim() || null,
    acceptsEntries: form.get("acceptsEntries") === "on",
    startDate: String(form.get("startDate") || "").trim() || null,
    endDate: String(form.get("endDate") || "").trim() || null,
    notes: String(form.get("notes") || "").trim() || null,
    active: form.get("active") === "on",
  };
  try {
    await api(
      `/financeiro/cadastros/centros-custo${id ? `/${encodeURIComponent(id)}` : ""}`,
      { method: id ? "PUT" : "POST", body: JSON.stringify(data) },
    );
  } catch (error) {
    if (error instanceof BackendError) return { error: error.message };
    throw error;
  }
  revalidatePath("/ajustes/financeiro/centros-custo");
  return { error: null };
}
