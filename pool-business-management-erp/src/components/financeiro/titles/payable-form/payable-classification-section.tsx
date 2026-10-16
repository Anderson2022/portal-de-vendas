import type { PayableFormState } from "./payable-form-types";
import { useDimensionOptions } from "../../dimensoes/use-dimension-options";
import { PayableDimensionFields } from "./payable-dimension-fields";
import { currency } from "./payable-form-utils";

type Props = {
  state: PayableFormState;
  amount: number;
  allocationTotal: number;
  update: <K extends keyof PayableFormState>(
    key: K,
    value: PayableFormState[K],
  ) => void;
  updateAllocation: (
    id: string,
    patch: { costCenter?: string; percentage?: number },
  ) => void;
};

export function PayableClassificationSection({
  state,
  amount,
  allocationTotal,
  update,
  updateAllocation,
}: Props) {
  const { options, error } = useDimensionOptions();
  return (
    <section className="space-y-5">
      <header>
        <h3 className="text-lg font-extrabold">Classificação financeira</h3>
        <p className="text-sm text-slate-500">
          Organize o título para relatórios e análise de resultado.
        </p>
      </header>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {!options && !error && (
        <p className="text-sm text-slate-500">Carregando classificações…</p>
      )}
      {options && <PayableDimensionFields options={options} />}
      <input
        type="hidden"
        name="allocations"
        value={JSON.stringify(
          state.allocations.map((item) => ({
            costCenterId: item.costCenter,
            percentage: item.percentage,
          })),
        )}
      />
      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold">Rateio por centro de custo</h4>
            <p className="text-xs text-slate-500">
              O total deve fechar em 100%.
            </p>
          </div>
          <button
            type="button"
            className="fin-button"
            onClick={() =>
              update("allocations", [
                ...state.allocations,
                {
                  id: crypto.randomUUID(),
                  costCenter: "",
                  percentage: Math.max(0, 100 - allocationTotal),
                },
              ])
            }
          >
            + Adicionar rateio
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {state.allocations.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_100px_130px_36px] items-center gap-2"
            >
              <select
                className="input"
                aria-label="Centro de custo do rateio"
                value={item.costCenter}
                onChange={(event) =>
                  updateAllocation(item.id, { costCenter: event.target.value })
                }
              >
                <option value="">Selecione um centro</option>
                {options?.centers
                  .filter((center) => center.active && center.acceptsEntries)
                  .map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.code} — {center.name}
                    </option>
                  ))}
              </select>
              <input
                className="input"
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={item.percentage}
                onChange={(event) =>
                  updateAllocation(item.id, {
                    percentage: Number(event.target.value),
                  })
                }
              />
              <span className="text-right text-sm font-semibold">
                {currency((amount * item.percentage) / 100)}
              </span>
              <button
                type="button"
                aria-label="Remover rateio"
                onClick={() =>
                  update(
                    "allocations",
                    state.allocations.filter(
                      (allocation) => allocation.id !== item.id,
                    ),
                  )
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {state.allocations.length > 0 && (
          <p
            className={`mt-3 text-right text-sm font-bold ${allocationTotal === 100 ? "text-emerald-700" : "text-red-700"}`}
          >
            Total: {allocationTotal.toFixed(2)}%
          </p>
        )}
      </div>
    </section>
  );
}
