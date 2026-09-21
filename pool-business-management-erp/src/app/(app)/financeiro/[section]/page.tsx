import { notFound } from "next/navigation";
import { session } from "@/lib/backend/client";
import { canFinance } from "@/lib/financeiro/permissions";
import { getFinancialData } from "@/lib/financeiro/services/get-financial-data";
import { pendingCapabilities } from "@/lib/financeiro/capabilities";
import { CapabilityPending } from "@/components/financeiro/shared/capability-pending";
import { FinancialState } from "@/components/financeiro/shared/financial-state";
import { TitlesView } from "@/components/financeiro/titles/titles-view";
import { CashFlowView } from "@/components/financeiro/reports/cash-flow-view";
import { ReportsHub } from "@/components/financeiro/reports/reports-hub";
import type { SearchValues } from "@/lib/financeiro/types";
export default async function FinancialSection({
  params,
  searchParams,
}: {
  params: Promise<{
    section: string;
  }>;
  searchParams: Promise<SearchValues>;
}) {
  const [{ section }, search, user] = await Promise.all([
    params,
    searchParams,
    session(),
  ]);
  if (!canFinance(user.permissions, "view"))
    return (
      <FinancialState
        error
        title="Acesso não autorizado"
        description="Seu perfil não permite consultar informações financeiras."
      />
    );
  const capability = pendingCapabilities.find((item) => item.slug === section);
  if (capability) return <CapabilityPending capability={capability} />;
  if (section === "relatorios") return <ReportsHub />;
  if (
    ![
      "contas-pagar",
      "contas-receber",
      "pagamentos",
      "recebimentos",
      "movimentacoes",
      "inadimplencia",
      "fluxo-caixa",
    ].includes(section)
  )
    notFound();
  const { titles, suppliers } = await getFinancialData();
  if (section === "fluxo-caixa")
    return <CashFlowView titles={titles} search={search} />;
  return (
    <TitlesView
      suppliers={suppliers}
      section={section}
      titles={titles}
      search={search}
    />
  );
}
