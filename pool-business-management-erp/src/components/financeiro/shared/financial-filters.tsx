import Link from "next/link";
import type { FinancialFilters } from "@/lib/financeiro/types";
export function FinancialFiltersBar({ filters, path, settled = false, hideStatus = false }: {
    filters: FinancialFilters;
    path: string;
    settled?: boolean;
    hideStatus?: boolean;
}) {
    return <form action={path} className="fin-panel fin-filters" aria-label="Filtros financeiros">
    <label className="sm:col-span-2">Pesquisar<input name="q" defaultValue={filters.q} placeholder="Descrição ou identificador" type="search" maxLength={150}/></label>
    {!settled && !hideStatus && <label>Status<select name="status" defaultValue={filters.status}><option value="">Todos</option><option value="PENDING">Pendentes</option><option value="OVERDUE">Vencidos</option><option value="PAID">Quitados</option><option value="CANCELLED">Cancelados</option></select></label>}
    <label>{settled ? "Quitação inicial" : "Vencimento inicial"}<input name="from" type="date" defaultValue={filters.from}/></label>
    <label>{settled ? "Quitação final" : "Vencimento final"}<input name="to" type="date" defaultValue={filters.to} min={filters.from || undefined}/></label>
    <label>Ordenação<select name="sort" defaultValue={filters.sort}><option value="dueDate">Vencimento crescente</option><option value="-dueDate">Vencimento decrescente</option><option value="-amount">Maior valor</option><option value="amount">Menor valor</option><option value="description">Descrição</option></select></label>
    <label>Por página<select name="size" defaultValue={filters.size}><option>20</option><option>50</option><option>100</option></select></label>
    <div className="flex items-end gap-2"><button className="fin-button fin-primary" type="submit">Filtrar</button><Link className="fin-button" href={path}>Limpar</Link></div>
  </form>;
}
