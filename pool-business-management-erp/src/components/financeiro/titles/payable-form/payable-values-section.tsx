import type {
  PayableFormState,
  InstallmentPreview,
} from "./payable-form-types";
import { currency, moneyValue } from "./payable-form-utils";

type Props = {
  state: PayableFormState;
  netAmount: number;
  installments: InstallmentPreview[];
  update: <K extends keyof PayableFormState>(
    key: K,
    value: PayableFormState[K],
  ) => void;
};

export function PayableValuesSection({
  state,
  netAmount,
  installments,
  update,
}: Props) {
  return (
    <section className="space-y-5">
      <header>
        <h3 className="text-lg font-extrabold">Valores e vencimento</h3>
        <p className="text-sm text-slate-500">
          Defina o valor líquido e as condições do título.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MoneyField
          label="Valor original *"
          name="amount"
          required
          onChange={(value) => update("amount", value)}
        />
        <MoneyField
          label="Juros"
          name="interest"
          onChange={(value) => update("interest", value)}
        />
        <MoneyField
          label="Multa"
          name="fine"
          onChange={(value) => update("fine", value)}
        />
        <MoneyField
          label="Desconto"
          name="discount"
          onChange={(value) => update("discount", value)}
        />
        <label className="text-sm font-semibold">
          Vencimento *
          <input
            className="input mt-1 w-full"
            name="dueDate"
            type="date"
            value={state.dueDate}
            onChange={(event) => update("dueDate", event.target.value)}
            required
          />
        </label>
      </div>
      <div className="rounded-2xl bg-blue-50 p-4 text-right">
        <span className="text-sm text-blue-700">Valor líquido</span>
        <strong className="ml-4 text-xl text-blue-950">
          {currency(netAmount)}
        </strong>
      </div>
      <label className="flex items-center gap-3 font-semibold">
        <input
          type="checkbox"
          checked={state.installmentsEnabled}
          onChange={(event) =>
            update("installmentsEnabled", event.target.checked)
          }
        />{" "}
        Parcelar este título
      </label>
      {state.installmentsEnabled && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-semibold">
              Número de parcelas
              <input
                className="input mt-1 w-full"
                type="number"
                min={2}
                max={120}
                value={state.installments}
                onChange={(event) =>
                  update("installments", Number(event.target.value))
                }
              />
            </label>
            <label className="text-sm font-semibold">
              Intervalo em dias
              <input
                className="input mt-1 w-full"
                type="number"
                min={1}
                value={state.intervalDays}
                onChange={(event) =>
                  update("intervalDays", Number(event.target.value))
                }
              />
            </label>
            <label className="text-sm font-semibold">
              Primeira parcela
              <input
                className="input mt-1 w-full"
                type="date"
                value={state.firstDueDate}
                onChange={(event) => update("firstDueDate", event.target.value)}
              />
            </label>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            {installments.map((item) => (
              <div
                key={item.number}
                className="grid grid-cols-3 border-b border-slate-100 px-4 py-2 text-sm last:border-0"
              >
                <strong>
                  {item.number}/{installments.length}
                </strong>
                <span>{item.dueDate.split("-").reverse().join("/")}</span>
                <span className="text-right font-semibold">
                  {currency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function MoneyField({
  label,
  name,
  required,
  onChange,
}: {
  label: string;
  name: string;
  required?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        className="input mt-1 w-full"
        name={name}
        inputMode="decimal"
        placeholder="0,00"
        required={required}
        onChange={(event) => onChange(moneyValue(event.target.value))}
      />
    </label>
  );
}
