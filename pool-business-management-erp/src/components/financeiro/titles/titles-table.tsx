"use client";
import { useState } from "react";
import type { FinancialTitle } from "@/lib/financeiro/types";
import { currency } from "@/lib/financeiro/money";
import { displayDate } from "@/lib/financeiro/dates";
import { StatusBadge } from "../shared/status-badge";
import { Can } from "../shared/financial-context";
import { TitleDetails } from "./title-details";
import { SettlementDialog } from "./settlement-dialog";
import { useFinancialPreference } from "../shared/use-financial-preference";
export function TitlesTable({ rows, settled = false }: {
    rows: FinancialTitle[];
    settled?: boolean;
}) {
    const [detail, setDetail] = useState<FinancialTitle | null>(null), [settlement, setSettlement] = useState<FinancialTitle | null>(null);
    const [notice, setNotice] = useState("");
    const [densityValue, setDensity] = useFinancialPreference("pool-finance-density", "normal");
    const [columns, setColumns] = useFinancialPreference("pool-finance-hidden-columns", "[]");
    const compact = densityValue === "compact";
    let hidden: string[] = [];
    try {
        const parsed: unknown = JSON.parse(columns);
        if (Array.isArray(parsed))
            hidden = parsed.filter((value): value is string => typeof value === "string");
    }
    catch { }
    const optional = ["Pessoa", "Forma de pagamento"];
    function setHidden(update: (current: string[]) => string[]) { setColumns(JSON.stringify(update(hidden))); }
    function density() { setDensity(compact ? "normal" : "compact"); }
    return <section className="fin-panel">{notice && <p role="status" className="fin-notice mb-3">{notice}</p>}<div className="mb-4 flex flex-wrap items-center justify-between gap-2"><span className="fin-muted text-sm">{rows.length} títulos nesta página</span><div className="flex gap-2"><details className="relative"><summary className="fin-button cursor-pointer">Colunas</summary><div className="fin-panel absolute right-0 z-10 mt-2 min-w-52">{optional.map(column => <label key={column} className="flex gap-2 py-2 text-sm"><input type="checkbox" checked={!hidden.includes(column)} onChange={() => setHidden(current => current.includes(column) ? current.filter(value => value !== column) : [...current, column])}/>{column}</label>)}</div></details><button className="fin-button" onClick={density}>Densidade {compact ? "compacta" : "normal"}</button></div></div><div className="overflow-x-auto"><table id="financial-titles-table" className="fin-table" data-density={compact ? "compact" : "normal"}><caption className="sr-only">Títulos financeiros da empresa atual</caption><thead><tr><th>Status</th><th>Título / descrição</th>{!hidden.includes("Pessoa") && <th>Pessoa</th>}<th>Vencimento</th>{settled && <th>Quitação</th>}{!hidden.includes("Forma de pagamento") && <th>Forma de pagamento</th>}<th className="text-right">Valor original</th><th className="text-right">Saldo do título</th><th>Ações</th></tr></thead><tbody>{rows.map(row => <tr key={`${row.kind}-${row.id}`}><td><StatusBadge title={row}/></td><td><button className="text-left font-semibold hover:underline" onClick={() => setDetail(row)}>{row.description}</button><div className="fin-muted text-xs">#{row.id} · {row.kind === "payable" ? "A pagar" : "A receber"}</div></td>{!hidden.includes("Pessoa") && <td>{row.party}</td>}<td>{displayDate(row.dueDate)}</td>{settled && <td>{displayDate(row.paidAt)}</td>}{!hidden.includes("Forma de pagamento") && <td>{row.paymentMethod || "—"}</td>}<td className="text-right font-semibold whitespace-nowrap">{currency(row.amount)}</td><td className="text-right whitespace-nowrap">{row.status === "CANCELLED" ? "—" : currency(row.status === "PAID" ? "0" : row.amount)}</td><td><div className="flex gap-2"><button className="fin-button" onClick={() => setDetail(row)} aria-label={`Detalhes do título ${row.id}`}>Detalhes</button>{["PENDING", "OVERDUE"].includes(row.status) && <Can action="create"><button className="fin-button fin-primary" onClick={() => setSettlement(row)}>{row.kind === "payable" ? "Pagar" : "Receber"}</button></Can>}</div></td></tr>)}</tbody></table></div>{detail && <TitleDetails title={detail} onClose={() => setDetail(null)}/>} {settlement && <SettlementDialog title={settlement} onClose={() => setSettlement(null)} onSuccess={setNotice}/>}</section>;
}
