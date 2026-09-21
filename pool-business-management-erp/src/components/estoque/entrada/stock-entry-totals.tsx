import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { StockEntryItem } from "./stock-entry-types";

type Props = {
  items: StockEntryItem[];
  freight: number;
  discount: number;
  otherExpenses: number;
  onFreightChange: (value: number) => void;
  onDiscountChange: (value: number) => void;
  onOtherExpensesChange: (value: number) => void;
};

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function StockEntryTotals({
  items,
  freight,
  discount,
  otherExpenses,
  onFreightChange,
  onDiscountChange,
  onOtherExpensesChange,
}: Props) {
  const productTotal = items.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = Math.max(
    0,
    productTotal + freight + otherExpenses - discount
  );

  return (
    <section className="rounded-[22px] border border-white/70 bg-white/70 p-5 shadow-sm">
      <div className="grid grid-cols-12 items-end gap-4">
        <div className="col-span-2">
          <Field label="Total produtos">
            <Input
              readOnly
              value={money.format(productTotal)}
              className="input font-extrabold"
            />
          </Field>
        </div>

        <div className="col-span-2">
          <Field label="Frete">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={freight}
              onChange={(e) => onFreightChange(Number(e.target.value) || 0)}
              className="input"
            />
          </Field>
        </div>

        <div className="col-span-2">
          <Field label="Desconto geral">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => onDiscountChange(Number(e.target.value) || 0)}
              className="input"
            />
          </Field>
        </div>

        <div className="col-span-2">
          <Field label="Outras despesas">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={otherExpenses}
              onChange={(e) =>
                onOtherExpensesChange(Number(e.target.value) || 0)
              }
              className="input"
            />
          </Field>
        </div>

        <div className="col-span-4 rounded-2xl bg-slate-950 px-5 py-4 text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">
            Total da entrada
          </div>
          <div className="mt-1 text-[24px] font-black">
            {money.format(grandTotal)}
          </div>
        </div>
      </div>
    </section>
  );
}
