"use server";

import { revalidatePath } from "next/cache";
import { api } from "../backend/client";

const value = (fd: FormData, key: string) =>
  String(fd.get(key) ?? "").trim();

export async function createClient(fd: FormData) {
  const name = value(fd, "name");
  const phone = value(fd, "phone");

  if (!name) {
    throw new Error("Nome do cliente é obrigatório.");
  }

  await api("/customers", {
    method: "POST",
    body: JSON.stringify({
      name,

      email:
        value(fd, "email") || null,

      phone:
        phone || null,

      whatsapp:
        value(fd, "whatsapp") || phone || null,

      documentNumber:
        value(fd, "document") || null,

      address:
        value(fd, "address") || null,

      city:
        value(fd, "city") || null,

      state:
        value(fd, "state") || null,

      source: "PoolControl",
    }),
  });

  revalidatePath("/clientes");
  revalidatePath("/", "layout");
}