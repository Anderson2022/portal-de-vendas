"use server";
import { api } from "@/lib/backend/client";
export type ProjectResult = {
  contract: number;
  budget: number;
  cost: number;
  revenue: number;
};
export async function getProjectResult(id: string) {
  return api<ProjectResult>(
    `/financeiro/cadastros/projetos/${encodeURIComponent(id)}/resultado`,
  );
}
