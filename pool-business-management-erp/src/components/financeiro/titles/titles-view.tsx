import Link from "next/link";
import type { FinancialTitle, SearchValues } from "@/lib/financeiro/types";
import { readFilters, filterTitles, paginateTitles } from "@/lib/financeiro/filter-titles";
import { currency } from "@/lib/financeiro/money";
import { delinquency } from "@/lib/financeiro/cash-flow";
import { FinancialHeader } from "../shared/financial-header";
import { FinancialFiltersBar } from "../shared/financial-filters";
import { FinancialPagination } from "../shared/financial-pagination";
import { FinancialState } from "../shared/financial-state";
import { CreatePayableDialog } from "./create-payable-dialog";
import { TitlesTable } from "./titles-table";
const screens: Record<string, {
    title: string;
    description: string;
    kind?: "payable" | "receivable";
    settled?: boolean;
}> = {
    "contas-pagar": { title: "Contas a pagar", description: "Obrigações, vencimentos e pagamentos integrais.", kind: "payable" },
    "contas-receber": { title: "Contas a receber", description: "Títulos gerados pelas vendas e seus recebimentos.", kind: "receivable" },
    pagamentos: { title: "Pagamentos", description: "Títulos com quitação integral registrada. Pagamentos parciais e estornos ainda não estão disponíveis.", kind: "payable", settled: true },
    recebimentos: { title: "Recebimentos", description: "Títulos recebidos integralmente. A confirmação bancária depende de conciliação.", kind: "receivable", settled: true },
    movimentacoes: { title: "Movimentações", description: "Consulta das quitações de títulos. O livro financeiro completo, transferências e estornos ainda não estão disponíveis.", settled: true },
    inadimplencia: { title: "Inadimplência", description: "Recebíveis em aberto com vencimento anterior à data atual.", kind: "receivable" },
};
export function TitlesView({ section, titles, search, suppliers }: {
    section: string;
    titles: FinancialTitle[];
    search: SearchValues;
    suppliers: Array<{
        id: string;
        name: string;
    }>;
}) {
    const screen = screens[section], path = `/financeiro/${section}`;
    const filters = readFilters(search);
    if (screen.settled)
        filters.status = "PAID";
    if (section === "inadimplencia")
        filters.status = "OVERDUE";
    const source = titles.filter(row => !screen.kind || row.kind === screen.kind);
    const rows = filterTitles(source, filters, screen.settled), page = paginateTitles(rows, filters);
    return <><FinancialHeader title={screen.title} description={screen.description}>{section === "contas-pagar" && <CreatePayableDialog suppliers={suppliers}/>}{section === "contas-receber" && <Link className="fin-button" href="/vendas/pedidos/novo">Nova venda</Link>}</FinancialHeader>{section === "inadimplencia" && <div className="mb-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">{delinquency(rows).map(group => <div className="fin-panel" key={group.label}><p className="fin-muted text-sm">{group.label}</p><strong className="mt-2 block">{currency(group.amount)}</strong><small>{group.count} títulos</small></div>)}</div>}<FinancialFiltersBar key={JSON.stringify(filters)} filters={filters} path={path} settled={screen.settled} hideStatus={section === "inadimplencia"}/>{filters.from && filters.to && filters.from > filters.to && <p role="alert" className="fin-negative my-3">A data final deve ser igual ou posterior à inicial.</p>}<div className="my-4 flex flex-wrap justify-between gap-2 text-sm"><span>{page.totalElements} títulos encontrados</span><strong>Valor original total: {currency(page.total)}</strong></div>{page.content.length ? <TitlesTable rows={page.content} settled={screen.settled}/> : <FinancialState title="Nenhum título encontrado" description="Revise os filtros ou aguarde novos lançamentos da empresa."/>}<FinancialPagination result={page} filters={filters} path={path}/></>;
}
