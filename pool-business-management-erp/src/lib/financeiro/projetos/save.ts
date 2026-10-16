"use server";
import { revalidatePath } from "next/cache";
import { api, BackendError } from "@/lib/backend/client";
export async function saveProject(id: string | null, form: FormData) {
  const data = {
    code: String(form.get("code") || "").trim(),
    name: String(form.get("name") || "").trim(),
    customerId: String(form.get("customerId") || "").trim() || null,
    unitId: String(form.get("unitId") || "").trim() || null,
    costCenterId: String(form.get("costCenterId") || "").trim() || null,
    responsibleId: String(form.get("responsibleId") || "").trim() || null,
    type: String(form.get("type") || "").trim(),
    status: String(form.get("status") || "").trim(),
    startDate: String(form.get("startDate") || "").trim() || null,
    expectedEndDate: String(form.get("expectedEndDate") || "").trim() || null,
    actualEndDate: String(form.get("actualEndDate") || "").trim() || null,
    contractAmount: Number(form.get("contractAmount") || 0),
    costBudget: Number(form.get("costBudget") || 0),
    expectedRevenue: Number(form.get("expectedRevenue") || 0),
    description: String(form.get("description") || "").trim() || null,
    notes: String(form.get("notes") || "").trim() || null,
    active: form.get("active") === "on",
  };
  try {
    await api(
      `/financeiro/cadastros/projetos${id ? `/${encodeURIComponent(id)}` : ""}`,
      { method: id ? "PUT" : "POST", body: JSON.stringify(data) },
    );
  } catch (error) {
    if (error instanceof BackendError) return { error: error.message };
    throw error;
  }
  revalidatePath("/ajustes/financeiro/projetos");
  return { error: null };
}
