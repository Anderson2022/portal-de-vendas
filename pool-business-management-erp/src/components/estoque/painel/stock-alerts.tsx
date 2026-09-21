import { TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui";

import type { StockOverviewData } from "./stock-overview-types";
export function StockAlerts({ alerts }: { alerts: StockOverviewData["rows"] }) {
  return (<Card className="fade-up mt-5 p-5" >
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-2 text-[13px] font-extrabold text-coral-500">
        <TriangleAlert size={16} />
        Reposição necessária
      </span>
      <div className="flex flex-wrap gap-2">
        {alerts.map((a) => (
          <span key={a.id} className={`badge ${a.status === "BAIXO" ? "badge-amber" : "badge-red"}`}>
            {a.name}: disp. {a.available} / mín. {a.minStock}
          </span>
        ))}
      </div>
    </div>
  </Card>);
}
