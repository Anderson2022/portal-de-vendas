"use server";
import { api } from "@/lib/backend/client";
export type HistoryRow = {
  id: string;
  occurredAt: string;
  userName: string;
  snapshot: string;
};
export async function getDimensionHistory(route: string, id: string) {
  if (
    ![
      "centros-custo",
      "unidades",
      "projetos",
      "naturezas-financeiras",
    ].includes(route)
  )
    throw new Error("Cadastro inválido");
  return api<HistoryRow[]>(
    `/financeiro/cadastros/${route}/${encodeURIComponent(id)}/historico`,
  );
}
