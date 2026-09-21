"use client";
import { documentCode } from "@/lib/format";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, Badge } from "@/components/ui";
import { Button, ButtonLink } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { brl, dateBR, quoteStatusMap } from "@/lib/format";
import { updateQuoteStatus } from "@/lib/commercial/actions";
import type { CommercialQuote } from "@/lib/commercial/queries";
import { QuoteDetails } from "./quote-details";
import { ConversionForm } from "./conversion-form";
export function QuoteCard({ quote }: { quote: CommercialQuote }) {
  const [expanded, setExpanded] = useState(false);
  const [convert, setConvert] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  const status = quoteStatusMap[quote.status] || {
    label: quote.status,
    tone: "slate" as const,
  };
  const editable = !["FECHADO", "CANCELADO"].includes(quote.status);
  function change(status: string) {
    start(async () => {
      try {
        const result = await updateQuoteStatus(quote.id, status);
        if (!result.ok) setError(result.error);
        else {
          setCancel(false);
          router.refresh();
        }
      } catch {
        setError("Falha de conexão. Tente novamente.");
      }
    });
  }
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-ink-500">
            ORÇAMENTO #{documentCode(quote.number)}
          </p>
          <h3 className="mt-2 text-lg font-extrabold">{quote.customer}</h3>
          <p className="mt-1 text-sm text-ink-500">{quote.project}</p>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
      <dl className="my-5 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-ink-500">Valor total</dt>
          <dd className="mt-1 text-lg font-extrabold">
            {brl(Number(quote.total))}
          </dd>
        </div>
        <div>
          <dt className="text-ink-500">Validade</dt>
          <dd className="mt-2 font-bold">{dateBR(quote.validUntil)}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Responsável</dt>
          <dd className="mt-2 font-bold">{quote.seller}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Criado em</dt>
          <dd className="mt-2 font-bold">{dateBR(quote.createdAt)}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
          {expanded ? "Ocultar itens" : "Ver itens"}
        </Button>
        {editable && (
          <ButtonLink href={`/vendas/orcamentos/${quote.id}/editar`}>
            Editar
          </ButtonLink>
        )}
        {["ORCAMENTO", "NEGOCIACAO"].includes(quote.status) && (
          <Button
            variant="primary"
            onClick={() => setConvert(!convert)}
            aria-expanded={convert}
          >
            Gerar venda
          </Button>
        )}
        {editable && quote.status !== "NEGOCIACAO" && (
          <Button disabled={pending} onClick={() => change("NEGOCIACAO")}>
            Em negociação
          </Button>
        )}
        {editable && (
          <Button variant="danger" onClick={() => setCancel(true)}>
            Cancelar orçamento
          </Button>
        )}
        {quote.saleNumber && (
          <ButtonLink
            href={`/vendas/pedidos/${quote.saleNumber}`}
            variant="primary"
          >
            Ver venda #{documentCode(quote.saleNumber)}
          </ButtonLink>
        )}
      </div>
      {expanded && <QuoteDetails quote={quote} />}{" "}
      {convert && (
        <ConversionForm quoteId={quote.id} onCancel={() => setConvert(false)} />
      )}{" "}
      {cancel && (
        <div className="mt-5 space-y-3">
          <p className="text-sm">
            Cancelar o orçamento #{documentCode(quote.number)}? Ele continuará no histórico.
          </p>
          <Button
            variant="danger"
            disabled={pending}
            onClick={() => change("CANCELADO")}
          >
            Confirmar cancelamento
          </Button>{" "}
          <Button onClick={() => setCancel(false)}>Manter orçamento</Button>
        </div>
      )}
      {error && (
        <div className="mt-4">
          <Notice error>{error}</Notice>
        </div>
      )}
    </Card>
  );
}
