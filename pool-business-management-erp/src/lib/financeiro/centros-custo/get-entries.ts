"use server";
import { api } from "@/lib/backend/client";
export type CenterEntry = {
  id: string;
  description: string;
  dueDate: string;
  competenceDate: string;
  status: string;
  amount: number;
  percentage: number | null;
};
export async function getCenterEntries(id: string) {
  return api<CenterEntry[]>(
    `/financeiro/cadastros/centros-custo/${encodeURIComponent(id)}/lancamentos`,
  );
}
