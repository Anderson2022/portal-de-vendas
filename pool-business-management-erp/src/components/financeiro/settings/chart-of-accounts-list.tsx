"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, PageIntro } from "@/components/ui";
import type { ChartAccountRow } from "@/lib/financeiro/plano-contas/types";
export type { ChartAccountRow } from "@/lib/financeiro/plano-contas/types";
import { accountTree } from "@/lib/financeiro/plano-contas/account-tree";
import { ChartAccountTable } from "./chart-account-table";
export const CHART_ACCOUNTS_KEY =
  "poolcontrol:financial-register:categoria-plano-contas";
export function ChartOfAccountsList({
  initialRows,
}: {
  initialRows: ChartAccountRow[];
}) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const tree = useMemo(() => accountTree(initialRows), [initialRows]);
  const search = query.trim().toLowerCase();
  const matches = new Set(
    tree
      .filter(({ account: row }) =>
        `${row.code} ${row.shortCode} ${row.name}`
          .toLowerCase()
          .includes(search),
      )
      .flatMap(({ account, ancestors }) => [account.id, ...ancestors]),
  );
  const visible = tree.filter(({ account, ancestors }) =>
    search
      ? matches.has(account.id)
      : !ancestors.some((id) => collapsed.has(id)),
  );
  function toggle(id: string) {
    setLevel("custom");
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
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
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="mr-auto text-sm text-ink-500">
          Duplo clique para editar. Use as setas para ocultar ou mostrar
          subcontas.
        </span>
        <Button
          disabled={!!search}
          onClick={() => {
            setLevel("all");
            setCollapsed(new Set());
          }}
        >
          Expandir tudo
        </Button>
        <Button
          disabled={!!search}
          onClick={() => {
            setLevel("1");
            setCollapsed(
              new Set(
                tree
                  .filter((row) => row.hasChildren)
                  .map((row) => row.account.id),
              ),
            );
          }}
        >
          Recolher tudo
        </Button>
        <label className="flex items-center gap-2 text-sm">
          Exibir até o nível
          <select
            className="input"
            value={search ? "all" : level}
            disabled={!!search}
            onChange={(event) => {
              setLevel(event.target.value);
              const level = Number(event.target.value);
              setCollapsed(
                event.target.value === "all"
                  ? new Set()
                  : new Set(
                      tree
                        .filter(
                          (row) => row.depth + 1 >= level && row.hasChildren,
                        )
                        .map((row) => row.account.id),
                    ),
              );
            }}
          >
            <option value="all">Todos</option>
            {level === "custom" && (
              <option value="custom">Personalizado</option>
            )}
            {Array.from(
              { length: Math.max(1, ...tree.map((row) => row.depth + 1)) },
              (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ),
            )}
          </select>
        </label>
      </div>
      <Card className="mt-4 overflow-hidden">
        <ChartAccountTable
          rows={visible}
          collapsed={search ? new Set() : collapsed}
          toggle={toggle}
          searching={!!search}
        />
        {!visible.length && (
          <p className="p-10 text-center text-sm text-ink-500">
            {search
              ? "Nenhuma conta encontrada para a pesquisa."
              : "Nenhum plano de contas cadastrado. Use o botão Novo plano de contas."}
          </p>
        )}
      </Card>
    </div>
  );
}
