import type { ChartLookups } from "@/lib/financeiro/plano-contas/lookup-types";
import { notFound } from "next/navigation";
import { api, BackendError } from "@/lib/backend/client";
import type {
  ChartAccountDetail,
  ChartAccountRow,
} from "@/lib/financeiro/plano-contas/types";
import { ChartOfAccountsScreen } from "@/components/financeiro/settings/chart-of-accounts-screen";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  let account: ChartAccountDetail;
  try {
    account = await api<ChartAccountDetail>(
      `/financeiro/cadastros/plano-contas/${id}`,
    );
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) notFound();
    throw error;
  }
  const rows = await api<ChartAccountRow[]>(
    "/financeiro/cadastros/plano-contas",
  );
  const lookups = await api<ChartLookups>("/financeiro/cadastros/plano-contas/lookups");
  return (
    <ChartOfAccountsScreen
      key={account.id}
      account={account}
      lookups={lookups}
      childAccounts={rows.filter((row) => row.parentId === account.id)}
    />
  );
}
