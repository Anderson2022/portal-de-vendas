"use server";
import { api, BackendError } from "@/lib/backend/client";
import type { LookupOption } from "./lookup-types";
export async function createChartLookup(
  key: string,
  code: string,
  name: string,
  parentId?: string,
) {
  try {
    const option = await api<LookupOption>(
      `/financeiro/cadastros/plano-contas/lookups/${encodeURIComponent(key)}`,
      {
        method: "POST",
        body: JSON.stringify({ code, name, parentId: parentId || null }),
      },
    );
    return { option, error: null };
  } catch (error) {
    if (error instanceof BackendError)
      return { option: null, error: error.message };
    throw error;
  }
}
