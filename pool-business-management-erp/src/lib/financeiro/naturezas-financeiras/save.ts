"use server";
import { revalidatePath } from "next/cache";
import { api, BackendError } from "@/lib/backend/client";
export async function saveFinancialNature(id: string | null, form: FormData) {
  const data = {
    code: String(form.get("code") || "").trim(),
    name: String(form.get("name") || "").trim(),
    description: String(form.get("description") || "").trim() || null,
    parentId: String(form.get("parentId") || "").trim() || null,
    type: String(form.get("type") || "").trim(),
    group: String(form.get("group") || "").trim(),
    movement: String(form.get("movement") || "").trim(),
    affectsCashFlow: form.get("affectsCashFlow") === "on",
    affectsDre: form.get("affectsDre") === "on",
    affectsResult: form.get("affectsResult") === "on",
    acceptsEntries: form.get("acceptsEntries") === "on",
    displayOrder: Number(form.get("displayOrder") || 0),
    color: String(form.get("color") || "").trim() || null,
    icon: String(form.get("icon") || "").trim() || null,
    startDate: String(form.get("startDate") || "").trim() || null,
    endDate: String(form.get("endDate") || "").trim() || null,
    notes: String(form.get("notes") || "").trim() || null,
    active: form.get("active") === "on",
  };
  try {
    await api(
      `/financeiro/cadastros/naturezas-financeiras${id ? `/${encodeURIComponent(id)}` : ""}`,
      { method: id ? "PUT" : "POST", body: JSON.stringify(data) },
    );
  } catch (error) {
    if (error instanceof BackendError) return { error: error.message };
    throw error;
  }
  revalidatePath("/ajustes/financeiro/naturezas-financeiras");
  return { error: null };
}
