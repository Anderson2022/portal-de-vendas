import { Section, Field, TextField } from "../dimensoes/fields";
import type { CostCenter } from "@/lib/financeiro/centros-custo/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function CostCenterSection3({
  row,
}: {
  row: CostCenter | null;
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
