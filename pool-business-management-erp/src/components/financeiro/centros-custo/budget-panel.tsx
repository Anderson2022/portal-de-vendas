"use client";
import { Field } from "../dimensoes/fields";
import { Button } from "@/components/ui/button";
import { BudgetTable } from "../dimensoes/budget-table";
import { useBudget } from "../dimensoes/use-budget";
import { getCostCenterBudget } from "@/lib/financeiro/centros-custo/get-budget";
import { saveCostCenterBudget } from "@/lib/financeiro/centros-custo/save-budget";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function CostCenterBudgetPanel({
  id,
}: {
  id: string;
  options: DimensionOptions;
}) {
  const budget = useBudget(id, getCostCenterBudget);
  return (
    <section className="mt-6 space-y-4 border-t pt-5">
      <h3 className="font-bold">Orçamento e indicadores</h3>
      <p className="text-xs text-slate-500">
        Realizado: títulos pagos. Comprometido: títulos pendentes. Valores
        distribuídos por rateio, quando houver. Agrupamento mensal pelo
        vencimento.
      </p>
      <BudgetTable rows={budget.rows} />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void budget.save(() => saveCostCenterBudget(id, form));
        }}
      >
        <fieldset
          disabled={budget.pending}
          className="grid gap-3 md:grid-cols-2"
        >
          <Field label="Competência" name="period" type="month" required />
          <Field label="Valor orçado" name="planned" type="number" required />
          <Field label="Valor revisado" name="revised" type="number" />
          <Field label="Observação" name="notes" />
          <Button type="submit" variant="primary">
            {budget.pending ? "Salvando…" : "Salvar orçamento"}
          </Button>
        </fieldset>
      </form>
      {budget.error && (
        <p role="alert" className="text-sm text-red-700">
          {budget.error}
        </p>
      )}
    </section>
  );
}
