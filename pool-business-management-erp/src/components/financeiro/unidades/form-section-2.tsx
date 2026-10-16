import { Section, Check, SelectField } from "../dimensoes/fields";
import type { Unit } from "@/lib/financeiro/unidades/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function UnitSection2({
  row,
  options,
}: {
  row: Unit | null;
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
      <SelectField
        label="Centro de custo padrão"
        name="defaultCostCenterId"
        value={row?.defaultCostCenterId}
        options={options.centers}
      />
      <SelectField
        label="Conta bancária padrão"
        name="defaultBankAccountId"
        value={row?.defaultBankAccountId}
        options={options.banks}
      />
      <Check label="Ativo" name="active" value={row?.active ?? true} />
    </Section>
  );
}
