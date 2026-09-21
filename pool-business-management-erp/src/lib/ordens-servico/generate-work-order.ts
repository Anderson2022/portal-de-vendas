"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "../backend/client";

const value = (fd: FormData, key: string) =>
  String(fd.get(key) ?? "").trim();

type SaleResponse = {
  sale: {
    id: string;
    customerId: string;
    project: string;
  };
};

export async function generateWorkOrder(fd: FormData) {
  const saleId = value(fd, "saleId");

  if (!saleId) {
    throw new Error("Venda inválida.");
  }

  const result = await api<SaleResponse>(
    `/sales/${saleId}`
  );

  await api("/work-orders", {
    method: "POST",
    body: JSON.stringify({
      customerId: result.sale.customerId,
      type: "INSTALACAO",
      scheduledAt: new Date().toISOString(),
      description:
        `Instalação da venda ${result.sale.id}: ` +
        (result.sale.project || ""),
      laborCost: 0,
      materials: [],
    }),
  });

  revalidatePath("/ordens-servico");
  revalidatePath("/vendas");
  revalidatePath("/", "layout");

  redirect("/ordens-servico");
}