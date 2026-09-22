import { currency } from "./payable-form-utils";

export function PayableSummary({
  amount,
  interest,
  fine,
  discount,
  netAmount,
}: {
  amount: number;
  interest: number;
  fine: number;
  discount: number;
  netAmount: number;
}) {
  return (
    <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-0">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold">Resumo do título</h3>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
          Novo
        </span>
      </div>
      <dl className="space-y-3 text-sm">
        <SummaryLine label="Valor original" value={amount} />
        <SummaryLine label="Juros (+)" value={interest} />
        <SummaryLine label="Multa (+)" value={fine} />
        <SummaryLine label="Desconto (-)" value={discount} />
        <div className="border-t border-slate-200 pt-3">
          <SummaryLine label="Valor líquido" value={netAmount} strong />
        </div>
      </dl>
      <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
        O valor líquido entrará na previsão de caixa após o cadastro.
      </div>
      <div>
        <span className="text-sm text-slate-500">Situação inicial</span>
        <p className="mt-1 font-bold">Pendente</p>
      </div>
    </aside>
  );
}

function SummaryLine({
  label,
  value,
  strong,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 ${strong ? "text-lg font-extrabold" : ""}`}
    >
      <dt>{label}</dt>
      <dd>{currency(value)}</dd>
    </div>
  );
}
