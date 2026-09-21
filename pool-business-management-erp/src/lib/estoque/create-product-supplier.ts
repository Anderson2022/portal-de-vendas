"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/backend/client";

export async function createProductSupplier(input: { name: string; documentNumber?: string; phone?: string; email?: string }) {
  const name = input.name.trim();
  if (!name) throw new Error("Informe o nome do fornecedor.");
  const supplier = await api<{ id: string; name: string }>("/suppliers", {
    method: "POST",
    body: JSON.stringify({ name, documentNumber: input.documentNumber?.trim() || null, phone: input.phone?.trim() || null, email: input.email?.trim() || null }),
  });
  revalidatePath("/estoque");
  return supplier;
}
