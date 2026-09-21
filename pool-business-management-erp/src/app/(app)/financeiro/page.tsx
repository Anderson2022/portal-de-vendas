import { redirect } from "next/navigation";
import { FinancialDashboard } from "@/components/financeiro/financial-dashboard";
import { getFinancialData } from "@/lib/financeiro/services/get-financial-data";
import type { SearchValues } from "@/lib/financeiro/types";
export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<SearchValues>;
}) {
  const search = await searchParams;
  if (search.f === "receber") redirect("/financeiro/contas-receber");
  if (search.f === "pagar") redirect("/financeiro/contas-pagar");
  const data = await getFinancialData();
  return <FinancialDashboard titles={data.titles} suppliers={data.suppliers} />;
}
