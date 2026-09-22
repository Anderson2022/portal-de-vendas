"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, PageIntro } from "@/components/ui";
export type ChartAccountRow = {
  id: string;
  code: string;
  shortCode: string;
  name: string;
  active: boolean;
  parentName?: string;
  nature?: string;
  accountType?: string;
};
export const CHART_ACCOUNTS_KEY =
  "poolcontrol:financial-register:categoria-plano-contas";
export function ChartOfAccountsList({
  initialRows,
}: {
  initialRows: ChartAccountRow[];
}) {
  const rows = initialRows;
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      rows.filter((row) =>
        `${row.code} ${row.shortCode} ${row.name}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [rows, query],
  );
  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[
          { label: "Configurações", href: "/ajustes" },
          { label: "Financeiro", href: "/ajustes/financeiro" },
          { label: "Plano de Contas" },
        ]}
        title="Plano de Contas"
        subtitle="Consulte a estrutura contábil e mantenha as contas da empresa."
      />
      <Card className="mt-6 p-5">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-64 flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              className="input w-full !pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por código, código reduzido ou descrição"
            />
          </div>
          <Link href="/ajustes/financeiro/categoria-plano-contas/novo">
            <Button variant="primary">
              <Plus size={16} /> Novo plano de contas
            </Button>
          </Link>
        </div>
      </Card>
      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl w-full min-w-[900px]">
            <thead>
              <tr>
                <th>Código</th>
                <th>Código reduzido</th>
                <th>Descrição</th>
                <th>Conta pai</th>
                <th>Tipo</th>
                <th>Natureza</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <td className="font-bold">{row.code}</td>
                  <td>{row.shortCode}</td>
                  <td>{row.name}</td>
                  <td>{row.parentName || "—"}</td>
                  <td>{row.accountType || "—"}</td>
                  <td>{row.nature || "—"}</td>
                  <td>
                    <span
                      className={row.active ? "text-green-700" : "text-red-700"}
                    >
                      {row.active ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!visible.length && (
          <p className="p-10 text-center text-sm text-ink-500">
            Nenhum plano de contas cadastrado. Use o botão “Novo plano de
            contas”.
          </p>
        )}
      </Card>
    </div>
  );
}
