"use server";

import { revalidatePath } from "next/cache";
import { api } from "../backend/client";

const value = (fd: FormData, key: string) =>
  String(fd.get(key) ?? "").trim();

export async function markReceivableReceived(fd: FormData) {
  const id = value(fd, "id");

  if (!id) {
    throw new Error("Conta a receber inválida.");
  }

  await api(`/financial/receivables/${id}/pay`, {
    method: "POST",
  });

  revalidatePath("/financeiro");
  revalidatePath("/", "layout");
}