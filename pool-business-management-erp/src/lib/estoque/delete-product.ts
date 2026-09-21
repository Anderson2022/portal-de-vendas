"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/backend/client";

export async function deleteProduct(id: string) {
  await api(`/products/${id}`, { method: "DELETE" });
  revalidatePath("/estoque");
}
