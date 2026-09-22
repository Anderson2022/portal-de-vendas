import { FinancialLookupField } from "../../settings/financial-lookup-field";

export function PayablePaymentSection() {
  return (
    <section className="space-y-5">
      <header>
        <h3 className="text-lg font-extrabold">Pagamento previsto</h3>
        <p className="text-sm text-slate-500">
          Informe como a obrigação deverá ser paga.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">
          Conta prevista *
          <input
            className="input mt-1 w-full"
            name="expectedAccount"
            placeholder="Conta bancária ou caixa"
          />
        </label>
        <label className="text-sm font-semibold">
          Forma de pagamento *
          <select className="input mt-1 w-full" name="paymentMethod">
            <option value="">Selecione</option>
            <option>PIX</option>
            <option>Boleto</option>
            <option>Transferência</option>
            <option>Dinheiro</option>
            <option>Cartão</option>
            <option>Débito automático</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Favorecido / chave PIX
          <input className="input mt-1 w-full" name="pixKey" />
        </label>
        <label className="text-sm font-semibold">
          Código de barras
          <input
            className="input mt-1 w-full"
            name="barcode"
            inputMode="numeric"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 font-semibold">
          <input type="checkbox" name="requiresApproval" /> Exigir aprovação
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 font-semibold">
          <input type="checkbox" name="recurring" /> Pagamento recorrente
        </label>
      </div>
    </section>
  );
}
