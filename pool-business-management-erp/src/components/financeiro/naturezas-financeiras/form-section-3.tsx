import { Section, Field, TextField } from "../dimensoes/fields";
import type { FinancialNature } from "@/lib/financeiro/naturezas-financeiras/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function FinancialNatureSection3({
  row,
}: {
  row: FinancialNature | null;
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
      <Field label="Data fim" name="endDate" value={row?.endDate} type="date" />
      <TextField label="Observação" name="notes" value={row?.notes} />
    </Section>
  );
}
