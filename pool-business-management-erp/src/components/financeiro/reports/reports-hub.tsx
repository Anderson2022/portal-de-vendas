import Link from "next/link";
import { FinancialHeader } from "../shared/financial-header";
const reports = [
    ["Contas a pagar", "contas-pagar", "Obrigações, status e vencimentos."],
    ["Contas a receber", "contas-receber", "Recebíveis por vencimento e situação."],
    ["Pagamentos", "pagamentos", "Quitações de contas a pagar."],
    ["Recebimentos", "recebimentos", "Quitações de contas a receber."],
    ["Fluxo de caixa", "fluxo-caixa", "Entradas, saídas e resultado no período."],
    ["Inadimplência", "inadimplencia", "Títulos vencidos e faixas de atraso."],
    ["DRE gerencial", "dre", "Aguardando integração de competência e classificação."],
    ["Orçamento", "orcamento", "Aguardando integração de orçamento financeiro."],
];
export function ReportsHub() {
    return <><FinancialHeader title="Relatórios financeiros" description="Consulte os dados da empresa com filtros por período e situação."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{reports.map(([title, slug, description]) => <Link className="fin-panel" key={slug} href={`/financeiro/${slug}`}><h2 className="font-bold">{title} →</h2><p className="fin-muted mt-2 text-sm">{description}</p></Link>)}</div><p className="fin-muted mt-5 text-sm">Exportação de Excel, CSV e PDF será disponibilizada quando suportada pela integração.</p></>;
}
