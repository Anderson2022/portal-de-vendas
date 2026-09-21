import { Avatar, Bar, Card, SectionTitle } from "@/components/ui";
import {
  brl
} from "@/lib/format";
import {
  Trophy
} from "lucide-react";
import type { SalesOverviewData } from "./sales-overview-types";

export function SalesRanking({ ov }: { ov: SalesOverviewData }) {

  return (
    <Card className="fade-up p-6" >
      <SectionTitle
        icon={<Trophy size={17} strokeWidth={2.4} />}
        title="Ranking de vendedores"
        action={{ label: "Este mês", href: "/vendedores" }}
      />
      <div className="mt-5 space-y-5">
        {ov.ranking.slice(0, 3).map((r, i) => (
          <div key={r.id} className="flex items-center gap-3.5">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${i === 0 ? "bg-sun-100 text-[#b57708]" : "bg-ink-100/70 text-ink-500"
              }`}>
              {i + 1}º
            </span>
            <Avatar name={r.name} size={38} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[13.5px] font-extrabold text-ink-900">{r.name}</span>
                <span className="text-[13px] font-extrabold tabular-nums text-ink-900">{brl(r.total)}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2.5">
                <Bar value={(r.total / (ov.ranking[0]?.total || 1)) * 100} tone={i === 0 ? "green" : undefined} className="flex-1" />
                <span className="text-[11px] font-bold text-ink-300">{r.count} vendas</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
