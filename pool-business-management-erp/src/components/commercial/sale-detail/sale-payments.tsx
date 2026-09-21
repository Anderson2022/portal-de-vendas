import { Badge, Card, SectionTitle } from "@/components/ui";
import { brl, dateBR, finStatusMap, n } from "@/lib/format";
import {
  CalendarDays
} from "lucide-react";
import type { SaleDetailData } from "./sale-detail-types";

export function SalePayments({ payments }: { payments: SaleDetailData["payments"] }) {

  return (
    <Card className="fade-up p-6" >
      <SectionTitle
        icon={<CalendarDays size={17} strokeWidth={2.4} />}
        title="Condição de pagamento"
        action={{ label: "Ver no financeiro", href: "/financeiro" }}
      />
      <div className="mt-4 space-y-1.5">
        {payments.map((p) => {
          const st = finStatusMap[p.status];
          return (
            <div key={p.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-water-50/60">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-extrabold tabular-nums text-ink-300">{dateBR(p.dueDate)}</span>
                <span className="text-[13px] font-semibold text-ink-700">{p.description}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wide text-ink-300">{p.method}</span>
                <span className="text-[13.5px] font-extrabold tabular-nums text-ink-900">{brl(n(p.amount))}</span>
                <Badge tone={st.tone}>{st.label}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
