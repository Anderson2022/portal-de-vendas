"use server";

import { revalidatePath } from "next/cache";
import { api } from "../backend/client";

const value = (fd: FormData, key: string) =>
  String(fd.get(key) ?? "").trim();

export async function advanceWorkOrder(fd: FormData) {
  const id = value(fd, "id");
  const next = value(fd, "next");

  if (!id) {
    throw new Error("Ordem de serviço inválida.");
  }

  if (!["EXECUCAO", "CONCLUIDA"].includes(next)) {
    throw new Error("Transição não suportada pela API.");
  }

  const action =
    next === "CONCLUIDA"
      ? "complete"
      : "start";

  await api(`/work-orders/${id}/${action}`, {
    method: "POST",
  });

  revalidatePath("/ordens-servico");
  revalidatePath("/", "layout");
}