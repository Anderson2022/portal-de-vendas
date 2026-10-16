import { ChartOfAccountsScreen } from "@/components/financeiro/settings/chart-of-accounts-screen";
import { api } from "@/lib/backend/client";
import type { ChartLookups } from "@/lib/financeiro/plano-contas/lookup-types";
export default async function Page() {
  const lookups = await api<ChartLookups>("/financeiro/cadastros/plano-contas/lookups");
  return <ChartOfAccountsScreen lookups={lookups} />;
}
