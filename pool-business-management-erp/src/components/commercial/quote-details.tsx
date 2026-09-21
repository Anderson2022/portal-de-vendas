import { brl } from "@/lib/format";
import type { CommercialQuote } from "@/lib/commercial/queries";
export function QuoteDetails({ quote }: { quote: CommercialQuote }) {
  return (
    <div className="inset-soft mt-5 space-y-3 rounded-xl p-4 text-xs">
      <h4 className="font-bold">Itens da proposta</h4>
      {quote.items.map((i) => (
        <div key={i.id} className="flex justify-between gap-4">
          <span>
            {i.qty} × {i.description}
          </span>
          <strong className="shrink-0">
            {brl(i.qty * Number(i.unitPrice))}
          </strong>
        </div>
      ))}
      <div className="flex justify-between border-t border-ink-100 pt-3">
        <span>Desconto</span>
        <strong>{brl(Number(quote.discount))}</strong>
      </div>
      {quote.notes && (
        <p className="whitespace-pre-wrap leading-relaxed text-ink-500">
          {quote.notes}
        </p>
      )}
    </div>
  );
}
