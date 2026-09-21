import { Ellipsis } from "lucide-react";
import { money } from "@/lib/financeiro/utils";
import { StatusPill } from "./status-pill";

export function TransactionsTable({
  title,
  accent,
  rows,
}: {
  title: string;
  accent: "green" | "red";
  rows: Array<{ due: string; description: string; value: number; status: string }>;
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-soft">
      <div className="flex items-center justify-between px-4 py-4 xl:px-5">
        <div className="flex items-center gap-3">
          <div className={"flex h-9 w-9 items-center justify-center rounded-xl " + (accent === "green" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>↓</div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
        <button className="text-xs font-semibold text-blue-600">Ver todos</button>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[610px] border-collapse text-left">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/60 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 xl:px-5">Vencimento</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ação</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.due + row.description} className="border-b border-slate-100 text-xs text-slate-600 last:border-0">
                <td className="px-4 py-3.5 xl:px-5">{row.due}</td>
                <td className="px-4 py-3.5 font-medium text-slate-700">{row.description}</td>
                <td className="px-4 py-3.5">{money(row.value)}</td>
                <td className="px-4 py-3.5"><StatusPill status={row.status} /></td>
                <td className="px-4 py-3.5"><button className="rounded-lg p-1 hover:bg-slate-100"><Ellipsis className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
