import { Boxes, Package, Wallet, TriangleAlert } from "lucide-react";
import { Stat } from "@/components/ui";

import { brl } from "@/lib/format";

import type { StockOverviewData } from "./stock-overview-types";
export function StockStats({ s }: { s: StockOverviewData }) {
  return (<div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
    <Stat compact icon={<Boxes size={22} strokeWidth={2.2} />} label="Itens cadastrados" value={String(s.rows.length)} />
    <Stat compact icon={<Package size={22} strokeWidth={2.2} />} label="Unidades fÃ­sicas" value={s.totalUnits.toLocaleString("pt-BR")} />
    <Stat compact icon={<Wallet size={22} strokeWidth={2.2} />} label="Valor em custo" value={brl(s.totalValue)} />
    <Stat
      icon={<TriangleAlert size={22} strokeWidth={2.2} />} label="Itens crÃ­ticos" value={String(s.critical + s.rupture)}
      accent={<div className="mt-1 text-xs font-bold text-coral-500">{s.low} com estoque baixo</div>}
    />
  </div>);
}

