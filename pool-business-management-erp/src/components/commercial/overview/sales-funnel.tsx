import { Bar, Card, SectionTitle } from "@/components/ui";
import {
  brl, pct
} from "@/lib/format";
import {
  ChevronRight,
  FileText, MessagesSquare, Trophy,
  Users
} from "lucide-react";
import type { SalesOverviewData } from "./sales-overview-types";

export function SalesFunnel({ ov }: { ov: SalesOverviewData }) {
  const funnelTotal =
    ov.funnel.lead.count + ov.funnel.orcamento.count + ov.funnel.negociacao.count + ov.funnel.fechado.count;
  const stages = [
    { key: "Lead", icon: <Users size={20} strokeWidth={2.2} />, data: ov.funnel.lead, desc: "no pipeline", cls: "from-[#e4f1fb] to-white" },
    { key: "Orçamento", icon: <FileText size={20} strokeWidth={2.2} />, data: ov.funnel.orcamento, desc: "em elaboração", cls: "from-[#dcedfb] to-white" },
    { key: "Negociação", icon: <MessagesSquare size={20} strokeWidth={2.2} />, data: ov.funnel.negociacao, desc: "propostas enviadas", cls: "from-[#fdf0d8] to-white" },
    { key: "Fechado", icon: <Trophy size={20} strokeWidth={2.2} className="!text-mint-600" />, data: ov.funnel.fechado, desc: "vendas realizadas", cls: "from-[#dcf6e9] to-white" },
  ];

  return (
    <Card className="fade-up p-6" >
      <SectionTitle
        icon={<FileText size={17} strokeWidth={2.4} />}
        title="Funil de vendas"
        action={{ label: "Ver relatório completo", href: "/vendas/relatorios" }}
      />
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stages.map((s, i) => {
          const share = funnelTotal ? (s.data.count / funnelTotal) * 100 : 0;
          return (
            <div key={s.key} className="relative">
              <div className={`h-full rounded-[22px] bg-gradient-to-b ${s.cls} p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_10px_20px_-12px_rgba(17,58,94,.25)]`}>
                <div className="flex items-center justify-between">
                  <span className="text-water-600">{s.icon}</span>
                </div>
                <div className="mt-2 text-[13px] font-bold text-ink-500">{s.key}</div>
                <div className="text-[24px] font-extrabold leading-tight text-ink-950 tabular-nums">{s.data.count}</div>
                <div className="text-[12.5px] font-bold text-ink-700 tabular-nums">{brl(s.data.value)}</div>
                <div className="text-[11px] font-medium text-ink-300">{s.desc}</div>
                <div className="mt-3 flex items-center gap-2">
                  <Bar value={share} tone={s.key === "Fechado" ? "green" : undefined} className="flex-1" />
                  <span className="text-[11px] font-extrabold text-ink-500 tabular-nums">{pct(share, 0)}</span>
                </div>
              </div>
              {i < stages.length - 1 && (
                <ChevronRight size={16} className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-water-400 xl:block" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
