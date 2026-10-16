"use client";
import { Field, SelectField } from "../dimensoes/fields";
import { Button } from "@/components/ui/button";
import { BudgetTable } from "../dimensoes/budget-table";
import { useBudget } from "../dimensoes/use-budget";
import { getProjectBudget } from "@/lib/financeiro/projetos/get-budget";
import { saveProjectBudget } from "@/lib/financeiro/projetos/save-budget";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function ProjectBudgetPanel({
  id,
  options,
}: {
  id: string;
  options: DimensionOptions;
}) {
  const budget = useBudget(id, getProjectBudget);
  return (
    <section className="mt-6 space-y-4 border-t pt-5">
      <h3 className="font-bold">Orçamento e indicadores</h3>
      <p className="text-xs text-slate-500">
        Realizado: títulos pagos. Comprometido: títulos pendentes. Valores
        distribuídos por rateio, quando houver.
      </p>
      <BudgetTable rows={budget.rows} />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void budget.save(() => saveProjectBudget(id, form));
        }}
      >
        <fieldset
          disabled={budget.pending}
          className="grid gap-3 md:grid-cols-2"
        >
          <SelectField
            label="Plano de contas"
            name="chartAccountId"
            options={options.accounts}
            required
          />
          <SelectField
            label="Centro de custo"
            name="costCenterId"
            options={options.centers}
            required
          />
          <Field label="Valor orçado" name="planned" type="number" required />
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
