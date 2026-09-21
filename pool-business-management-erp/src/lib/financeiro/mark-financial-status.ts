"use server";

import { revalidatePath } from "next/cache";
import { api } from "../backend/client";

const value = (fd: FormData, key: string) =>
  String(fd.get(key) ?? "").trim();

type FinancialType =
  | "RECEIVABLE"
  | "PAYABLE";

export async function markFinancialStatus(fd: FormData) {
  const id = value(fd, "id");

  const type = (
    value(fd, "type") ||
    value(fd, "financialType")
  ) as FinancialType;

  if (!id) {
    throw new Error("Registro financeiro inválido.");
  }

  if (!type) {
    throw new Error("Tipo financeiro não informado.");
  }

  switch (type) {
    case "RECEIVABLE":
      await api(
        `/financial/receivables/${id}/pay`,
        {
          method: "POST",
        }
      );
      break;

    case "PAYABLE":
      await api(
        `/financial/payables/${id}/pay`,
        {
          method: "POST",
        }
      );
      break;

    default:
      throw new Error(
        "Tipo financeiro não suportado."
      );
  }

  revalidatePath("/financeiro");
  revalidatePath("/", "layout");
}