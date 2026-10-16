import {
  Section,
  Field,
  TextField,
  SelectField,
  choices,
} from "../dimensoes/fields";
import type { Project } from "@/lib/financeiro/projetos/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function ProjectSection1({
  row,
}: {
  row: Project | null;
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
        label="Tipo"
        name="type"
        value={row?.type ?? "INSTALACAO"}
        options={choices(
          "INSTALACAO:Instalação|OBRA:Obra|CONTRATO:Contrato|INTERNO:Interno",
        )}
        required
      />
      <TextField
        label="Descrição"
        name="description"
        value={row?.description}
      />
    </Section>
  );
}
