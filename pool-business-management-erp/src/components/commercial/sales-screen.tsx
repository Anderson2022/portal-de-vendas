"use client";
import { useState } from "react";
import { Card, PageIntro } from "@/components/ui";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentFilters } from "./document-filters";
import { DocumentStats } from "./document-stats";
import { SaleCard } from "./sale-card";
import { brl } from "@/lib/format";
import type { CommercialSale } from "@/lib/commercial/queries";
export function SalesScreen({ sales }: { sales: CommercialSale[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const active = sales.filter((s) => s.status !== "CANCELADA");
  const filtered = sales.filter(
    (s) =>
      (!status ||
        (status === "PAGA"
          ? s.paid && s.status !== "CANCELADA"
          : status === "PENDENTE"
            ? !s.paid && s.status !== "CANCELADA"
            : s.status === status)) &&
      `${s.number} ${s.customer} ${s.seller}`
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase()),
  );
  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[
          { label: "Início", href: "/inicio" },
          { label: "Vendas", href: "/vendas" },
          { label: "Pedidos" },
        ]}
        title="Vendas e pedidos"
        subtitle="Acompanhe as vendas confirmadas, os pagamentos e o resultado de cada pedido."
        right={
          <ButtonLink href="/vendas/pedidos/novo" variant="primary">
            Registrar venda direta
          </ButtonLink>
        }
      />
      <DocumentStats
        items={[
          {
            label: "Total vendido",
            value: brl(
              active.reduce((sum, s) => sum + Number(s.totalValue), 0),
            ),
            hint: "Histórico de vendas não canceladas",
          },
          {
            label: "Recebido",
            value: brl(active.reduce((sum, s) => sum + s.received, 0)),
            hint: "Pagamentos registrados no financeiro",
          },
          {
            label: "A receber",
            value: brl(active.reduce((sum, s) => sum + s.outstanding, 0)),
            hint: "Saldo dos pedidos em aberto",
          },
          {
            label: "Pedidos",
            value: String(active.length),
            hint: "Vendas confirmadas e entregues",
          },
        ]}
      />
      <Card className="mb-6 p-5">
        <DocumentFilters
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          statuses={[
            { value: "PAGA", label: "Recebidas" },
            { value: "PENDENTE", label: "A receber" },
            { value: "ENTREGUE", label: "Entregues" },
            { value: "CANCELADA", label: "Canceladas" },
          ]}
          count={filtered.length}
        />
        <ButtonLink href="/vendas/orcamentos">
          Ver orçamentos para converter
        </ButtonLink>
      </Card>
      <div className="space-y-5">
        {filtered.map((s) => (
          <SaleCard key={s.id} sale={s} />
        ))}
      </div>
      {!filtered.length && (
        <Card>
          <EmptyState
            title="Nenhuma venda encontrada"
            description="Ajuste os filtros, converta um orçamento ou registre uma venda direta."
          />
        </Card>
      )}
    </div>
  );
}
