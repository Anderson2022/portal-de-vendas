import { Card, SectionTitle } from "@/components/ui";
import { brl, n } from "@/lib/format";
import {
  ReceiptText
} from "lucide-react";
import type { SaleDetailData } from "./sale-detail-types";

export function SaleItemsTable({ items }: { items: SaleDetailData["items"] }) {

  return (
    <Card className="fade-up overflow-hidden p-6 pb-3" >
      <SectionTitle icon={<ReceiptText size={17} strokeWidth={2.4} />} title="Itens da venda" />
      <div className="-mx-6 mt-4 overflow-x-auto">
        <table className="tbl min-w-[560px]">
          <thead>
            <tr><th>Item</th><th className="text-center">Qtd.</th><th className="text-right">Preço unit.</th><th className="text-right">Custo unit.</th><th className="text-right">Total</th></tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td className="font-semibold">{i.description}</td>
                <td className="text-center tabular-nums text-ink-500">{i.qty}</td>
                <td className="text-right tabular-nums">{brl(n(i.unitPrice))}</td>
                <td className="text-right tabular-nums text-ink-500">{brl(n(i.unitCost))}</td>
                <td className="text-right font-extrabold tabular-nums">{brl(n(i.unitPrice) * i.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
