import {
  Section,
  Field,
  TextField,
  SelectField,
  choices,
} from "../dimensoes/fields";
import type { Unit } from "@/lib/financeiro/unidades/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function UnitSection1({
  row,
  options,
}: {
  row: Unit | null;
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
      <SelectField
        label="Cadastro pai"
        name="parentId"
        value={row?.parentId}
        options={options.units.filter((item) => item.id !== row?.id)}
      />
      <SelectField
        label="Tipo"
        name="type"
        value={row?.type ?? "MATRIZ"}
        options={choices(
          "MATRIZ:Matriz|FILIAL:Filial|LOJA:Loja|DEPOSITO:Depósito|OPERACAO:Operação",
        )}
        required
      />
      <Field label="CNPJ" name="cnpj" value={row?.cnpj} type="text" />
      <Field label="Cidade" name="city" value={row?.city} type="text" />
      <Field
        label="UF"
        name="state"
        value={row?.state}
        type="text"
        maxLength={2}
      />
      <TextField label="Endereço" name="address" value={row?.address} />
    </Section>
  );
}
