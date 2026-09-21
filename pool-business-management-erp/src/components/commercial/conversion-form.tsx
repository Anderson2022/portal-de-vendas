"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { PaymentFields } from "./payment-fields";
import { submitConversion } from "@/lib/commercial/actions";
export function ConversionForm({
  quoteId,
  onCancel,
}: {
  quoteId: string;
  onCancel: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <form
      className="mt-5 space-y-4 border-t border-ink-100 pt-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          try {
            const result = await submitConversion(quoteId, {
              paymentMethod: String(fd.get("paymentMethod")),
              paid: fd.get("paid") === "true",
              dueDate: String(fd.get("dueDate")),
            });
            if (!result.ok) {
              setError(result.error);
              return;
            }
            router.push(`/vendas/pedidos/${result.id}`);
            router.refresh();
          } catch {
            setError("Falha de conexão. Tente novamente.");
          }
        });
      }}
    >
      <h4 className="text-sm font-bold">Confirmar venda</h4>
      <p className="text-xs text-ink-500">
        Confira o pagamento. A confirmação gera o pedido, a comissão e a conta a
        receber.
      </p>
      <fieldset disabled={pending}>
        <PaymentFields />
      </fieldset>
      {error && <Notice error>{error}</Notice>}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Gerando..." : "Confirmar e gerar venda"}
        </Button>
        <Button onClick={onCancel} disabled={pending}>
          Voltar
        </Button>
      </div>
    </form>
  );
}
