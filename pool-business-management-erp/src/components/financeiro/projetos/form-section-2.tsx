import { Section, Check, SelectField, choices } from "../dimensoes/fields";
import type { Project } from "@/lib/financeiro/projetos/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function ProjectSection2({
  row,
  options,
}: {
  row: Project | null;
  options: DimensionOptions;
}) {
  return (
    <Section title="Responsabilidade e classificação">
      <SelectField
        label="Cliente"
        name="customerId"
        value={row?.customerId}
        options={options.customers}
      />
      <SelectField
        label="Unidade responsável"
        name="unitId"
        value={row?.unitId}
        options={options.units}
      />
      <SelectField
        label="Centro de custo principal"
        name="costCenterId"
        value={row?.costCenterId}
        options={options.centers}
      />
      <SelectField
        label="Responsável"
        name="responsibleId"
        value={row?.responsibleId}
        options={options.users}
      />
      <SelectField
        label="Status"
        name="status"
        value={row?.status ?? "PLANEJADO"}
        options={choices(
          "PLANEJADO:Planejado|EM_ANDAMENTO:Em andamento|CONCLUIDO:Concluído|CANCELADO:Cancelado",
        )}
        required
      />
      <Check label="Ativo" name="active" value={row?.active ?? true} />
    </Section>
  );
}
