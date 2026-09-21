import { Badge } from "@/components/ui";
import { dateShort } from "@/lib/format";

export type AdjustmentHistoryItem = {
  id: string;
  product: string;
  quantity: number;
  reason: string;
  reference: string;
  createdBy: string;
  createdAt: string;
};

export function StockAdjustmentHistory({ rows }: { rows: AdjustmentHistoryItem[] }) {
  return <div className="overflow-hidden rounded-2xl border border-ink-100">
    <div className="grid grid-cols-[90px_1fr_100px_90px_1.5fr_140px] gap-3 bg-white/50 px-4 py-3 text-xs font-extrabold"><span>DATA</span><span>PRODUTO</span><span>TIPO</span><span>QTD.</span><span>MOTIVO / ORIGEM</span><span>USUÁRIO</span></div>
    {rows.map((row) => <div key={row.id} className="grid grid-cols-[90px_1fr_100px_90px_1.5fr_140px] gap-3 border-t border-ink-100 px-4 py-3 text-sm"><span>{dateShort(row.createdAt)}</span><strong>{row.product}</strong><span><Badge tone={row.quantity < 0 ? "red" : "green"}>{row.quantity < 0 ? "Saída" : "Entrada"}</Badge></span><strong>{row.quantity > 0 ? "+" : ""}{row.quantity}</strong><span>{row.reason || row.reference || "—"}</span><span>{row.createdBy}</span></div>)}
    {!rows.length && <p className="p-6 text-center text-sm text-ink-400">Nenhum ajuste registrado.</p>}
  </div>;
}
