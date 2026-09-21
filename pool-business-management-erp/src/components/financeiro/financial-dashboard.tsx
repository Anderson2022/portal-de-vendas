import Link from "next/link";
import { currency, total } from "@/lib/financeiro/money";
import { today, localDate } from "@/lib/financeiro/dates";
import { delinquency, cashFlowRows } from "@/lib/financeiro/cash-flow";
import { titleStatus } from "@/lib/financeiro/filter-titles";
import type { FinancialTitle } from "@/lib/financeiro/types";
import { FinancialHeader } from "./shared/financial-header";
import { CreatePayableDialog } from "./titles/create-payable-dialog";
import { TitlesTable } from "./titles/titles-table";
import { CashFlowChart } from "./reports/cash-flow-chart";
import { FinancialState } from "./shared/financial-state";
export function FinancialDashboard({
  titles,
  suppliers,
}: {
  titles: FinancialTitle[];
  suppliers: Array<{
    id: string;
    name: string;
  }>;
}) {
  const date = today(),
    month = date.slice(0, 7);
  const pending = titles.filter((title) =>
    ["PENDING", "OVERDUE"].includes(title.status),
  );
  const paidMonth = titles.filter(
    (title) =>
      title.status === "PAID" &&
      title.paidAt &&
      localDate(title.paidAt).startsWith(month),
  );
  const amount = (rows: FinancialTitle[]) =>
    currency(total(rows.map((row) => row.amount)));
  const metrics = [
    {
      label: "A receber em aberto",
      value: amount(pending.filter((row) => row.kind === "receivable")),
      href: "contas-receber",
    },
    {
      label: "A pagar em aberto",
      value: amount(pending.filter((row) => row.kind === "payable")),
      href: "contas-pagar",
    },
    {
      label: "Recebimentos do mês",
      value: amount(paidMonth.filter((row) => row.kind === "receivable")),
      href: "recebimentos",
    },
    {
      label: "Pagamentos do mês",
      value: amount(paidMonth.filter((row) => row.kind === "payable")),
      href: "pagamentos",
    },
    {
      label: "A receber hoje",
      value: amount(
        pending.filter(
          (row) => row.kind === "receivable" && row.dueDate === date,
        ),
      ),
      href: `contas-receber?from=${date}&to=${date}`,
    },
    {
      label: "A pagar hoje",
      value: amount(
        pending.filter((row) => row.kind === "payable" && row.dueDate === date),
      ),
      href: `contas-pagar?from=${date}&to=${date}`,
    },
    {
      label: "Recebíveis vencidos",
      value: amount(
        pending.filter(
          (row) => row.kind === "receivable" && titleStatus(row) === "OVERDUE",
        ),
      ),
      href: "inadimplencia",
    },
    {
      label: "Contas a pagar vencidas",
      value: String(
        pending.filter(
          (row) => row.kind === "payable" && titleStatus(row) === "OVERDUE",
        ).length,
      ),
      href: "contas-pagar?status=OVERDUE",
    },
  ];
  const flow = cashFlowRows(titles, "realizado", `${month}-01`, date),
    aging = delinquency(titles);
  return (
    <>
      <FinancialHeader
        title="Visão geral financeira"
        description="Títulos e quitações da empresa atual. Indicadores mensais usam a data de quitação registrada no ERP."
      >
        <CreatePayableDialog suppliers={suppliers} />
      </FinancialHeader>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            href={`/financeiro/${metric.href}`}
            className="fin-panel fin-kpi"
          >
            <span className="fin-muted text-sm">{metric.label}</span>
            <strong className="mt-3 block text-2xl tracking-tight">
              {metric.value}
            </strong>
            <span className="fin-muted mt-3 block text-xs">
              Consultar títulos →
            </span>
          </Link>
        ))}
      </div>
      <div className="my-5 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="fin-panel">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Entradas e saídas do mês</h2>
            <Link className="fin-link" href="/financeiro/fluxo-caixa">
              Ver fluxo
            </Link>
          </div>
          {flow.length ? (
            <CashFlowChart rows={flow} />
          ) : (
            <p className="fin-muted py-16 text-center">
              Nenhuma quitação registrada neste mês.
            </p>
          )}
          <p className="fin-muted text-xs">
            Resultado acumulado das quitações; não é saldo bancário disponível.
          </p>
        </section>
        <section className="fin-panel">
          <h2 className="font-bold">Aging da inadimplência</h2>
          <div className="mt-4 space-y-3">
            {aging.map((group) => (
              <Link
                key={group.label}
                href="/financeiro/inadimplencia"
                className="fin-subtle flex items-center justify-between rounded-xl p-3 text-sm"
              >
                <span>
                  {group.label}
                  <small className="fin-muted block">
                    {group.count} títulos
                  </small>
                </span>
                <strong>{currency(group.amount)}</strong>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Próximos vencimentos e pendências</h2>
        <Link className="fin-link" href="/financeiro/contas-receber">
          Consultar contas a receber
        </Link>
      </div>
      {pending.length ? (
        <TitlesTable
          rows={[...pending]
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
            .slice(0, 8)}
        />
      ) : (
        <FinancialState
          title="Nenhum título em aberto"
          description="As novas contas a pagar e os recebíveis gerados por vendas aparecerão aqui."
        />
      )}
      <p className="fin-muted mt-4 text-xs">
        Saldos bancários, margem, DRE e comparações gerenciais aguardam dados da
        integração financeira.
      </p>
    </>
  );
}
