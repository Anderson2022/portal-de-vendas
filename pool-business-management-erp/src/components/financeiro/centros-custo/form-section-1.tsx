import {
  Section,
  Field,
  TextField,
  SelectField,
  choices,
} from "../dimensoes/fields";
import type { CostCenter } from "@/lib/financeiro/centros-custo/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function CostCenterSection1({
  row,
  options,
}: {
  row: CostCenter | null;
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
        options={options.centers.filter((item) => item.id !== row?.id)}
      />
      <SelectField
        label="Tipo"
        name="type"
        value={row?.type ?? "ADMINISTRATIVO"}
        options={choices(
          "ADMINISTRATIVO:Administrativo|OPERACIONAL:Operacional|COMERCIAL:Comercial|LOGISTICA:Logística|PRODUCAO:Produção|PROJETO:Projeto|UNIDADE:Unidade|OUTROS:Outros",
        )}
        required
      />
    </Section>
  );
}
