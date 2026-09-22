import { notFound } from "next/navigation";
import { financialRegisters } from "@/components/financeiro/settings/financial-settings";
import { FinancialRegisterScreen } from "@/components/financeiro/settings/financial-register-screen";
import {
  ChartOfAccountsList,
  type ChartAccountRow,
} from "@/components/financeiro/settings/chart-of-accounts-list";
import { api } from "@/lib/backend/client";
export default async function Page({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params,
    register = financialRegisters.find(([slug]) => slug === kind);
  if (!register) notFound();
  if (kind === "categoria-plano-contas") {
    const rows = await api<ChartAccountRow[]>(
      "/financeiro/cadastros/plano-contas",
    );
    return <ChartOfAccountsList initialRows={rows} />;
  }
  return <FinancialRegisterScreen slug={register[0]} title={register[1]} />;
}
