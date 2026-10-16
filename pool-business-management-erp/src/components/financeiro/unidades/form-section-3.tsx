import { Section, Field, TextField } from "../dimensoes/fields";
import type { Unit } from "@/lib/financeiro/unidades/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function UnitSection3({
  row,
}: {
  row: Unit | null;
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
