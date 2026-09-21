import { ArrowDownToLine, ArrowUpFromLine, History, ArrowRightLeft } from "lucide-react";
import { Card, Badge, SectionTitle } from "@/components/ui";

import { dateShort, type Tone } from "@/lib/format";

import type { StockOverviewData } from "./stock-overview-types";
const movTone: Record<string, Tone> = {
  ENTRADA: "green", SAIDA: "red", AJUSTE: "amber", RESERVA: "blue", LIBERACAO: "slate",
};

export function StockMovements({ s }: { s: StockOverviewData }) {
  return (
    <Card className="fade-up p-6" >
      <SectionTitle icon={<History size={17} strokeWidth={2.4} />} title="Últimas movimentações" />
      <div className="mt-4 space-y-1">
        {s.movements.map((mv) => (
          <div key={mv.id} className="flex items-center gap-4 rounded-2xl px-3 py-2.5 transition hover:bg-water-50/60">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${mv.type === "ENTRADA" ? "bg-mint-100 text-mint-600" : mv.type === "SAIDA" ? "bg-coral-100 text-coral-500" : "bg-water-100 text-water-700"
              }`}>
              {mv.type === "ENTRADA" ? <ArrowDownToLine size={16} /> : mv.type === "SAIDA" ? <ArrowUpFromLine size={16} /> : <ArrowRightLeft size={16} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-extrabold text-ink-900">
                {mv.quantity > 0 ? "+" : ""}{mv.quantity} × {mv.product}
              </div>
              <div className="truncate text-[11.5px] font-medium text-ink-300">
                {mv.reason}{mv.reference ? ` · ${mv.reference}` : ""} · {mv.createdBy}
              </div>
            </div>
            <Badge tone={movTone[mv.type] ?? "slate"}>{mv.type}</Badge>
            <span className="w-12 text-right text-[11.5px] font-bold tabular-nums text-ink-300">{dateShort(mv.createdAt)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
