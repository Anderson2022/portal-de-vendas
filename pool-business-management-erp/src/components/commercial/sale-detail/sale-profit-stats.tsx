import { Bar, Card } from "@/components/ui";
import { brl, n, pct } from "@/lib/format";
import type { SaleDetailData } from "./sale-detail-types";

export function SaleProfitStats({ sale }: { sale: SaleDetailData["sale"] }) {
  const m = n(sale.margin);
  return (
    <div className="fade-up mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[
        { label: "Valor vendido", value: brl(n(sale.totalValue)), cls: "text-ink-950" },
        { label: "Custo total", value: brl(n(sale.totalCost)), cls: "text-ink-700" },
        { label: "Lucro real", value: brl(n(sale.profit)), cls: "text-mint-600" },
        { label: "Margem", value: pct(m), cls: m >= 25 ? "text-mint-600" : m >= 15 ? "text-[#b57708]" : "text-coral-500" },
      ].map((k, i) => (
        <Card key={k.label} className="fade-up p-5" >
          <div className="text-[12px] font-bold uppercase tracking-[0.07em] text-ink-300">{k.label}</div>
          <div className={`mt-1 text-[24px] font-extrabold tabular-nums ${k.cls}`}>{k.value}</div>
          {k.label === "Margem" && <Bar value={m} tone={m >= 25 ? "green" : "amber"} className="mt-2" />}
        </Card>
      ))}
    </div>
  );
}
