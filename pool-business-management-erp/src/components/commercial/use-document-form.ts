"use client";

import { submitQuote, submitSale } from "@/lib/commercial/actions";
import { totals, type EditorItem } from "@/lib/commercial/domain";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { DocumentFormProps } from "./document-form-types";

export function useDocumentForm({ quote, kind = "quote" }: Pick<DocumentFormProps, "quote" | "kind">) {
  const router = useRouter();
  const [items, setItems] = useState<EditorItem[]>(
    quote
      ? quote.items.map((i) => ({
        key: String(i.id),
        productId: i.productId,
        description: i.description,
        qty: String(i.qty),
        unitPrice: i.unitPrice,
        unitCost: i.unitCost,
      }))
      : [
        {
          key: "first",
          description: "",
          qty: "1",
          unitPrice: "0",
          unitCost: "0",
        },
      ],
  );
  const [discount, setDiscount] = useState(quote?.discount || "0");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const summary = totals(items, discount);
  const back = kind === "quote" ? "/vendas/orcamentos" : "/vendas/pedidos";
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");
    const data = {
      customerId: String(fd.get("customerId") || ""),
      salespersonId: String(fd.get("salespersonId") || "") || null,
      project: String(fd.get("project") || ""),
      validUntil: String(fd.get("validUntil") || ""),
      notes: String(fd.get("notes") || ""),
      discount,
      items,
      paymentMethod: String(fd.get("paymentMethod") || "PIX"),
      paid: fd.get("paid") === "true",
      dueDate: String(fd.get("dueDate") || ""),
    };
    start(async () => {
      try {
        const result =
          kind === "quote"
            ? await submitQuote(data, quote?.id)
            : await submitSale(data);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        router.push(
          kind === "quote"
            ? `${back}?salvo=${result.id}`
            : `${back}/${result.id}`,
        );
        router.refresh();
      } catch {
        setError("Não foi possível conectar ao servidor. Tente novamente.");
      }
    });
  };
  return { items, setItems, discount, setDiscount, error, pending, summary, back, submit };
}
