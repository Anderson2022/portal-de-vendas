import { Section, Check, SelectField } from "../dimensoes/fields";
import type { CostCenter } from "@/lib/financeiro/centros-custo/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function CostCenterSection2({
  row,
  options,
}: {
  row: CostCenter | null;
  options: DimensionOptions;
}) {
  return (
    <Section title="Responsabilidade e classificação">
      <SelectField
        label="Responsável"
        name="responsibleId"
        value={row?.responsibleId}
        options={options.users}
      />
      <Check
        label="Permitir lançamentos financeiros"
        name="acceptsEntries"
        value={row?.acceptsEntries ?? true}
      />
      <Check label="Ativo" name="active" value={row?.active ?? true} />
    </Section>
  );
}
