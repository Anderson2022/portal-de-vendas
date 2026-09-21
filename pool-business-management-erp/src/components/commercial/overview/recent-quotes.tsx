import { Badge, Card, SectionTitle } from "@/components/ui";
import { brl, dateShort, documentCode, n, quoteStatusMap } from "@/lib/format";
import {
  FileText,
  MoreHorizontal
} from "lucide-react";
import type { SalesOverviewData } from "./sales-overview-types";

export function RecentQuotes({ ov }: { ov: SalesOverviewData }) {

  return (
    <Card className="fade-up overflow-hidden p-6 pb-3" >
      <SectionTitle
        icon={<FileText size={17} strokeWidth={2.4} />}
        title="Orçamentos recentes"
        action={{ label: "Ver todos", href: "/vendas/orcamentos" }}
      />
      <div className="-mx-6 mt-4 overflow-x-auto">
        <table className="tbl min-w-[640px]">
          <thead>
            <tr>
              <th>#</th><th>Cliente</th><th>Projeto</th>
              <th className="text-right">Valor</th><th>Status</th><th>Data</th><th />
            </tr>
          </thead>
          <tbody>
            {ov.recentQuotes.map((q) => (
              <tr key={q.id}>
                <td className="font-extrabold text-ink-900">#{documentCode(q.number)}</td>
                <td className="font-semibold">{q.customer}</td>
                <td className="max-w-[220px] truncate text-ink-500">{q.project}</td>
                <td className="text-right font-extrabold tabular-nums">{brl(n(q.total))}</td>
                <td><Badge tone={quoteStatusMap[q.status].tone}>{quoteStatusMap[q.status].label}</Badge></td>
                <td className="tabular-nums text-ink-500">{dateShort(q.createdAt)}/2026</td>
                <td className="w-8 text-ink-300"><MoreHorizontal size={17} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
