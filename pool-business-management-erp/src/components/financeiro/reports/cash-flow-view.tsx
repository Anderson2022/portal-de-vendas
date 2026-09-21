import Link from "next/link";
import { currency } from "@/lib/financeiro/money";
import { cashFlowRows } from "@/lib/financeiro/cash-flow";
import { displayDate } from "@/lib/financeiro/dates";
import { readFilters } from "@/lib/financeiro/filter-titles";
import type { FinancialTitle, SearchValues } from "@/lib/financeiro/types";
import { FinancialHeader } from "../shared/financial-header";
import { FinancialState } from "../shared/financial-state";
import { CashFlowChart } from "./cash-flow-chart";
export function CashFlowView({ titles, search }: {
    titles: FinancialTitle[];
    search: SearchValues;
}) {
    const mode = search.mode === "previsto" ? "previsto" : "realizado";
    const filters = readFilters(search), rows = cashFlowRows(titles, mode, filters.from, filters.to);
    return <><FinancialHeader title="Fluxo de caixa" description="Entradas e saídas por data, calculadas a partir dos títulos da empresa."/><div className="flex gap-2 mb-4">{["realizado", "previsto"].map(value => <Link className={`fin-button ${value === mode ? "fin-primary" : ""}`} key={value} href={`?mode=${value}`} aria-current={mode === value ? "page" : undefined}>{value === "realizado" ? "Realizado" : "Previsto"}</Link>)}</div><form className="fin-panel fin-filters mb-4"><input type="hidden" name="mode" value={mode}/><label>Data inicial<input type="date" name="from" defaultValue={filters.from}/></label><label>Data final<input type="date" name="to" defaultValue={filters.to}/></label><button type="submit" className="fin-button fin-primary self-end">Aplicar período</button></form><p className="fin-muted mb-4 text-sm">{mode === "realizado" ? "Quitações integrais registradas no ERP. Não representa confirmação bancária." : "Títulos em aberto por vencimento; atrasados permanecem na data original."} O acumulado parte de zero no período e não representa saldo bancário. Projeção com saldo inicial depende das contas financeiras.</p>{rows.length ? <section className="fin-panel"><CashFlowChart rows={rows}/><div className="overflow-x-auto"><table className="fin-table"><caption className="sr-only">Fluxo financeiro por data</caption><thead><tr>{["Data", "Entradas", "Saídas", "Resultado", "Acumulado do período"].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.date}><td>{displayDate(row.date)}</td><td>{currency(row.incoming)}</td><td>{currency(row.outgoing)}</td><td>{currency(row.net)}</td><td className={row.accumulated.startsWith("-") ? "fin-negative" : "font-bold"}>{currency(row.accumulated)}</td></tr>)}</tbody></table></div></section> : <FinancialState title="Sem lançamentos no período" description="Altere as datas ou consulte os títulos em aberto."/>}</>;
}
