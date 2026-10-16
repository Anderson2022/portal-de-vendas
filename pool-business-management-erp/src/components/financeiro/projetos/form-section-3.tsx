import { Section, Field, TextField } from "../dimensoes/fields";
import type { Project } from "@/lib/financeiro/projetos/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function ProjectSection3({
  row,
}: {
  row: Project | null;
  options: DimensionOptions;
}) {
  return (
    <Section title="Valores e validade">
      <Field
        label="Data início"
        name="startDate"
        value={row?.startDate}
        type="date"
      />
      <Field
        label="Data prevista fim"
        name="expectedEndDate"
        value={row?.expectedEndDate}
        type="date"
      />
      <Field
        label="Data real fim"
        name="actualEndDate"
        value={row?.actualEndDate}
        type="date"
      />
      <Field
        label="Valor contratado"
        name="contractAmount"
        value={row?.contractAmount ?? 0}
        type="number"
        required
      />
      <Field
        label="Orçamento de custo"
        name="costBudget"
        value={row?.costBudget ?? 0}
        type="number"
        required
      />
      <Field
        label="Receita prevista"
        name="expectedRevenue"
        value={row?.expectedRevenue ?? 0}
        type="number"
        required
      />
      <TextField label="Observação" name="notes" value={row?.notes} />
    </Section>
  );
}
