"use server";

import { revalidatePath } from "next/cache";
import { api } from "../backend/client";

const value = (fd: FormData, key: string) =>
  String(fd.get(key) ?? "").trim();

export async function markPayablePaid(fd: FormData) {
  const id = value(fd, "id");

  if (!id) {
    throw new Error("Conta a pagar inválida.");
  }

  await api(`/financial/payables/${id}/pay`, {
    method: "POST",
  });

  revalidatePath("/financeiro");
  revalidatePath("/", "layout");
}