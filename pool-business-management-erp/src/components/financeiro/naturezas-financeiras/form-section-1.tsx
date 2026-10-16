import { Section, Field, TextField, SelectField } from "../dimensoes/fields";
import type { FinancialNature } from "@/lib/financeiro/naturezas-financeiras/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function FinancialNatureSection1({
  row,
  options,
}: {
  row: FinancialNature | null;
  options: DimensionOptions;
}) {
  return (
    <Section title="Identificação">
      <Field
        label="Código"
        name="code"
        value={row?.code}
        type="text"
        required
        maxLength={30}
      />
      <Field
        label="Nome"
        name="name"
        value={row?.name}
        type="text"
        required
        maxLength={150}
      />
      <TextField
        label="Descrição"
        name="description"
        value={row?.description}
      />
      <SelectField
        label="Cadastro pai"
        name="parentId"
        value={row?.parentId}
        options={options.natures.filter((item) => item.id !== row?.id)}
      />
    </Section>
  );
}
