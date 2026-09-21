import { Card } from "@/components/ui/card";
import { brl } from "@/lib/format";
export function DocumentSummary({
  subtotal,
  discount,
  total,
  count,
  children,
}: {
  subtotal: number;
  discount: number;
  total: number;
  count: number;
  children?: React.ReactNode;
}) {
  return (
    <Card className="p-6 lg:sticky lg:top-24">
      <h2 className="font-extrabold">Resumo</h2>
      <p className="mt-1 text-xs text-ink-500">
        {count} {count === 1 ? "item adicionado" : "itens adicionados"}
      </p>
      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-bold">{brl(subtotal / 100)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Desconto</dt>
          <dd className="font-bold">− {brl(discount / 100)}</dd>
        </div>
        <div className="inset-soft flex flex-wrap justify-between gap-2 rounded-xl p-4">
          <dt className="font-bold">Total</dt>
          <dd className="text-xl font-extrabold text-mint-600">
            {brl(total / 100)}
          </dd>
        </div>
      </dl>
      {children}
    </Card>
  );
}
