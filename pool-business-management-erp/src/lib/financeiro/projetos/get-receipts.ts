"use server";
import { api } from "@/lib/backend/client";
export type ProjectReceipt = {
  id: string;
  name: string;
  amount: number;
  status: string;
  projectId: string | number | null;
};
export async function getProjectReceipts(id: string) {
  return api<ProjectReceipt[]>(
    `/financeiro/cadastros/projetos/${encodeURIComponent(id)}/receitas`,
  );
}
