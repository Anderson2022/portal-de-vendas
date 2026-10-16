import { Card } from "@/components/ui";
import type {
  ChartAccountDetail,
  ChartAccountRow,
} from "@/lib/financeiro/plano-contas/types";
export function ChartAccountSummary({
  account,
  childAccounts,
}: {
  account?: ChartAccountDetail;
  childAccounts: ChartAccountRow[];
}) {
  return (
    <Card className="h-fit p-5">
      <h2 className="font-extrabold">Resumo da conta</h2>
      <div className="mt-4 rounded-full bg-green-100 px-3 py-2 text-center text-sm font-bold text-green-700">
        {account?.active === false ? "Inativa" : "Ativa"}
      </div>
      <dl className="mt-5 space-y-4 text-sm">
        <div>
          <dt className="text-ink-500">Última alteração</dt>
          <dd className="font-bold">
            {account?.updatedAt
              ? new Date(account.updatedAt).toLocaleString("pt-BR", {
                  timeZone: "America/Cuiaba",
                })
              : "Novo cadastro"}
          </dd>
        </div>
        <div>
          <dt className="text-ink-500">Total de subcontas</dt>
          <dd className="font-bold">{childAccounts.length}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Classificação</dt>
          <dd className="font-bold">Calculada pela hierarquia</dd>
        </div>
      </dl>
    </Card>
  );
}
