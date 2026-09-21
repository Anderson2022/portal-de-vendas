"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/backend/client";

export async function createProductCategory(name: string) {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 100) throw new Error("Informe uma categoria com até 100 caracteres.");
  const category = await api<{ id: string; name: string }>("/product-categories", {
    method: "POST", body: JSON.stringify({ name: trimmed }),
  });
  revalidatePath("/estoque");
  return category;
}
