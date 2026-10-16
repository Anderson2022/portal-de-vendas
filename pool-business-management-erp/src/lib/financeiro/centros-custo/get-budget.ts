"use server";
import { api } from "@/lib/backend/client";
import type { BudgetRow } from "../dimensoes/budget-types";
export async function getCostCenterBudget(id: string) {
  return api<BudgetRow[]>(
    `/financeiro/cadastros/centros-custo/${encodeURIComponent(id)}/orcamento`,
  );
}
