import { Card } from "@/components/ui/card";
import { brl } from "@/lib/format";
export function SaleConditions({ discount, notes }: { discount: string; notes: string }) {
  if (!Number(discount) && !notes) return null;
  return <Card className="p-6"><h2 className="font-extrabold">Condições da venda</h2><div className="mt-4 flex justify-between text-sm"><span>Desconto aplicado</span><strong>{brl(Number(discount))}</strong></div>{notes && <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-500">{notes}</p>}</Card>;
}
