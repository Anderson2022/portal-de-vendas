"use server";
import { revalidatePath } from "next/cache";
import { api, BackendError } from "@/lib/backend/client";
export async function saveUnit(id: string | null, form: FormData) {
  const data = {
    code: String(form.get("code") || "").trim(),
    name: String(form.get("name") || "").trim(),
    parentId: String(form.get("parentId") || "").trim() || null,
    type: String(form.get("type") || "").trim(),
    responsibleId: String(form.get("responsibleId") || "").trim() || null,
    cnpj: String(form.get("cnpj") || "").trim() || null,
    city: String(form.get("city") || "").trim() || null,
    state: String(form.get("state") || "").trim() || null,
    address: String(form.get("address") || "").trim() || null,
    defaultCostCenterId:
      String(form.get("defaultCostCenterId") || "").trim() || null,
    defaultBankAccountId:
      String(form.get("defaultBankAccountId") || "").trim() || null,
    startDate: String(form.get("startDate") || "").trim() || null,
    endDate: String(form.get("endDate") || "").trim() || null,
    notes: String(form.get("notes") || "").trim() || null,
    active: form.get("active") === "on",
  };
  try {
    await api(
      `/financeiro/cadastros/unidades${id ? `/${encodeURIComponent(id)}` : ""}`,
      { method: id ? "PUT" : "POST", body: JSON.stringify(data) },
    );
  } catch (error) {
    if (error instanceof BackendError) return { error: error.message };
    throw error;
  }
  revalidatePath("/ajustes/financeiro/unidades");
  return { error: null };
}
