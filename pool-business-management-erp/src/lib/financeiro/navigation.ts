import type { SideItem } from "@/components/module-shell";
const link = (slug: string, label: string) => ({ href: `/financeiro/${slug}`, label });
export const financialNavigation: SideItem[] = [
    { href: "/financeiro", label: "Visão geral", icon: "grid" },
    { ...link("contas-receber", "Contas a receber"), icon: "coins" },
    { ...link("contas-pagar", "Contas a pagar"), icon: "file" },
    { label: "Operações", icon: "orders", children: [link("pagamentos", "Pagamentos"), link("recebimentos", "Recebimentos"), link("movimentacoes", "Movimentações"), link("transferencias", "Transferências")] },
    { ...link("fluxo-caixa", "Fluxo de caixa"), icon: "chart" },
    { label: "Bancos e caixa", icon: "bank", children: [link("bancos", "Bancos"), link("contas", "Contas financeiras"), link("conciliacao", "Conciliação"), link("caixa", "Caixa")] },
    { label: "Meios de pagamento", icon: "coins", children: [link("pix", "PIX"), link("boletos", "Boletos"), link("cartoes", "Cartões e recebíveis"), link("adquirentes", "Adquirentes")] },
    { ...link("aprovacoes", "Aprovações"), icon: "orders" },
    { label: "Cobrança", icon: "users", children: [link("inadimplencia", "Inadimplência"), link("cobranca", "Régua de cobrança"), link("renegociacoes", "Renegociações"), link("recorrencias", "Recorrências")] },
    { label: "Planejamento", icon: "pie", children: [link("orcamento", "Orçamento financeiro"), link("dre", "DRE gerencial")] },
    { label: "Cadastros", icon: "settings", children: [link("categorias", "Categorias financeiras"), link("plano-contas", "Plano de contas"), link("centros-custos", "Centros de custo"), link("formas-pagamento", "Formas de pagamento")] },
    { ...link("relatorios", "Relatórios"), icon: "chart" },
    { ...link("auditoria", "Auditoria"), icon: "file" },
];
