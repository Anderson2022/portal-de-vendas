"use server";
import { api } from "@/lib/backend/client";
import type { BudgetRow } from "../dimensoes/budget-types";
export async function getProjectBudget(id: string) {
  return api<BudgetRow[]>(
    `/financeiro/cadastros/projetos/${encodeURIComponent(id)}/orcamento`,
  );
}
