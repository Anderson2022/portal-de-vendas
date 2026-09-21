"use client";
import { useState } from "react";
import { PageIntro, Card } from "@/components/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { Notice } from "@/components/ui/notice";
import { NewQuoteLink } from "./new-quote-link";
import { DocumentFilters } from "./document-filters";
import { DocumentStats } from "./document-stats";
import { QuoteCard } from "./quote-card";
import { brl, quoteStatusMap } from "@/lib/format";
import type { CommercialQuote } from "@/lib/commercial/queries";
export function QuotesScreen({
  quotes,
  initialStatus = "",
  saved = false,
}: {
  quotes: CommercialQuote[];
  initialStatus?: string;
  saved?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const open = quotes.filter((q) =>
    ["ORCAMENTO", "NEGOCIACAO"].includes(q.status),
  );
  const converted = quotes.filter((q) => q.status === "FECHADO").length;
  const filtered = quotes.filter(
    (q) =>
      (!status || q.status === status) &&
      `${q.number} ${q.customer} ${q.project}`
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase()),
  );
  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[
          { label: "Início", href: "/inicio" },
          { label: "Vendas", href: "/vendas" },
          { label: "Orçamentos" },
        ]}
        title="Orçamentos"
        subtitle="Crie a proposta, negocie com o cliente e confirme a venda quando ele aprovar."
        right={<NewQuoteLink />}
      />
      <DocumentStats
        items={[
          {
            label: "Em aberto",
            value: brl(open.reduce((s, q) => s + Number(q.total), 0)),
            hint: `${open.length} propostas aguardando fechamento`,
          },
          {
            label: "Em negociação",
            value: String(
              quotes.filter((q) => q.status === "NEGOCIACAO").length,
            ),
            hint: "Condições em conversa com o cliente",
          },
          {
            label: "Convertidos em venda",
            value: String(converted),
            hint: "Pedidos gerados no sistema",
          },
          {
            label: "Taxa de conversão",
            value: `${quotes.length ? Math.round((converted / quotes.length) * 100) : 0}%`,
            hint: `Sobre ${quotes.length} propostas do histórico`,
          },
        ]}
      />
      {saved && (
        <div className="mb-5">
          <Notice>
            Orçamento salvo. Confira os itens e use Gerar venda após a aprovação
            do cliente.
          </Notice>
        </div>
      )}
      <Card className="mb-6 p-5">
        <DocumentFilters
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          statuses={Object.entries(quoteStatusMap).map(([value, s]) => ({
            value,
            label: s.label,
          }))}
          count={filtered.length}
        />
        <p className="text-xs text-ink-500">
          1. Monte a proposta · 2. Negocie as condições · 3. Gere a venda
        </p>
      </Card>
      <div className="space-y-5">
        {filtered.map((q) => (
          <QuoteCard key={q.id} quote={q} />
        ))}
      </div>
      {!filtered.length && (
        <Card>
          <EmptyState
            title="Nenhum orçamento encontrado"
            description="Ajuste a busca ou crie um orçamento pelo botão acima."
          />
        </Card>
      )}
    </div>
  );
}
