import { documentCode } from "@/lib/format";
import { Card, Badge } from "@/components/ui";
import { ButtonLink } from "@/components/ui/button";
import { brl, dateBR, saleStatusMap } from "@/lib/format";
import type { CommercialSale } from "@/lib/commercial/queries";
export function SaleCard({ sale }: { sale: CommercialSale }) {
  const status = saleStatusMap[sale.status] || {
    label: sale.status,
    tone: "slate" as const,
  };
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-ink-500">
            VENDA #{documentCode(sale.number)} · {dateBR(sale.saleDate)}
          </p>
          <h3 className="mt-2 text-lg font-extrabold">{sale.customer}</h3>
        </div>
        <div className="flex gap-2">
          <Badge tone={status.tone}>{status.label}</Badge>
          {sale.status !== "CANCELADA" && (
            <Badge tone={sale.paid ? "green" : "amber"}>
              {sale.paid ? "Recebida" : "A receber"}
            </Badge>
          )}
        </div>
      </div>
      <dl className="my-5 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-ink-500">Total da venda</dt>
          <dd className="mt-1 text-lg font-extrabold">
            {brl(Number(sale.totalValue))}
          </dd>
        </div>
        <div>
          <dt className="text-ink-500">Pagamento</dt>
          <dd className="mt-2 font-bold">
            {sale.paymentSummary || "Não informado"}
          </dd>
        </div>
        <div>
          <dt className="text-ink-500">Saldo a receber</dt>
          <dd className="mt-2 font-bold">{brl(sale.outstanding)}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Vendedor</dt>
          <dd className="mt-2 font-bold">{sale.seller}</dd>
        </div>
      </dl>
      {sale.notes && (
        <p className="mb-4 whitespace-pre-wrap text-sm text-ink-500">
          {sale.notes}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={`/vendas/pedidos/${sale.number}`} variant="primary">
          Ver pedido e custos
        </ButtonLink>
        <ButtonLink href="/financeiro">Acompanhar recebimento</ButtonLink>
      </div>
    </Card>
  );
}
