import { Badge, Card, SectionTitle } from "@/components/ui";
import { brl, documentCode, n, pct } from "@/lib/format";
import {
  Coins,
  CreditCard,
  HandCoins,
  Landmark,
  Package, Truck
} from "lucide-react";
import type { FeaturedSaleData } from "./sales-overview-types";

export function FeaturedSaleCosts({ featured }: { featured: NonNullable<FeaturedSaleData> }) {
  const costIcon: Record<string, React.ReactNode> = {
    PRODUCT: <Package size={13} />,
    FREIGHT: <Truck size={13} />,
    COMMISSION: <HandCoins size={13} />,
    TAX: <Landmark size={13} />,
    CARD_FEE: <CreditCard size={13} />,
    OTHER: <Coins size={13} />,
  };

  return (
    <Card className="fade-up p-6" >
      <SectionTitle
        icon={<Coins size={17} strokeWidth={2.4} />}
        title="Custo Geral da Venda"
        action={{ label: "Ver detalhes", href: `/vendas/pedidos/${featured.sale.number}` }}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[12.5px] font-semibold text-ink-500">
        <span>Venda <b className="text-ink-900">#{documentCode(featured.sale.number)}</b></span>
        <span>·</span>
        <span>Cliente: {featured.customer}</span>
        <Badge tone="green">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
          Venda fechada
        </Badge>
      </div>

      <div className="mt-4 space-y-1">
        {featured.costLines.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl px-3 py-2 text-[13px] transition hover:bg-water-50/70">
            <span className="flex items-center gap-2 font-semibold text-ink-700">
              <span className="text-water-500">{costIcon[c.type] ?? costIcon.OTHER}</span>
              {c.description.replace("Custo — ", "")}
            </span>
            <span className="font-bold tabular-nums text-ink-900">{brl(n(c.amount))}</span>
          </div>
        ))}
      </div>

      <div className="my-3 h-px bg-ink-100/80" />
      <div className="space-y-1.5 px-3">
        <div className="flex items-center justify-between text-[13.5px] font-bold text-ink-700">
          <span>Valor da venda</span>
          <span className="tabular-nums">{brl(n(featured.sale.totalValue))}</span>
        </div>
        <div className="flex items-center justify-between text-[13.5px] font-bold text-ink-700">
          <span>Custo total</span>
          <span className="tabular-nums">{brl(n(featured.sale.totalCost))}</span>
        </div>
      </div>
      <div className="mt-3 rounded-2xl bg-gradient-to-r from-mint-100/90 to-mint-100/40 px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.9)]">
        <div className="flex items-center justify-between">
          <span className="text-[13.5px] font-extrabold text-mint-600">Lucro real</span>
          <span className="text-[21px] font-extrabold tabular-nums text-mint-600">{brl(n(featured.sale.profit))}</span>
        </div>
        <div className="mt-0.5 flex items-center justify-between">
          <span className="text-[12px] font-bold text-ink-500">Margem</span>
          <span className="text-[15px] font-extrabold tabular-nums text-mint-600">{pct(n(featured.sale.margin))}</span>
        </div>
      </div>
    </Card>
  );
}
