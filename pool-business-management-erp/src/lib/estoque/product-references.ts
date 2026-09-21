"use server";

import { api } from "@/lib/backend/client";
import type { LookupKind, LookupRecord } from "@/components/estoque/produto/lookup/lookup-types";

const remoteKind = (kind: LookupKind) => kind === "packageQuantity" || kind === "warranty" ? null : kind;

export async function listProductReferences(kind: LookupKind): Promise<LookupRecord[]> {
  const mapped = remoteKind(kind);
  if (!mapped) return [];
  try {
    const rows = await api<Array<{ id: string; name: string; code?: string | null }>>(`/product-references/${mapped}`);
    const records = rows.map((row) => ({ id: String(row.id), name: row.name, value: row.code || row.name, persisted: true }));
    if (kind !== "category") return records;
    return Promise.all(records.map(async (record) => {
      const details = await api<{ nivel?: number; active?: boolean }>(`/product-references/category/${record.id}`);
      return { ...record, level: Number(details.nivel || 1), active: details.active !== false };
    }));
  } catch {
    return [];
  }
}

export async function createProductReference(kind: LookupKind, name: string, code?: string, details: Record<string, string | boolean> = {}) {
  const mapped = remoteKind(kind);
  if (!mapped) return null;
  return api<{ id: string; name: string; code?: string | null }>(`/product-references/${mapped}`, {
    method: "POST", body: JSON.stringify({ name, code: code || null, ...details }),
  });
}

export async function getProductReference(kind: LookupKind, id: string) {
  return api<Record<string, string | boolean | null>>(`/product-references/${kind}/${id}`);
}

export async function updateProductReference(kind: LookupKind, id: string, name: string, code?: string, details: Record<string, string | boolean> = {}) {
  return api<{ id: string; name: string; code?: string | null }>(`/product-references/${kind}/${id}`, {
    method: "PUT", body: JSON.stringify({ name, code: code || null, ...details }),
  });
}

export async function deleteProductReference(kind: LookupKind, id: string) {
  return api<void>(`/product-references/${kind}/${id}`, { method: "DELETE" });
}
