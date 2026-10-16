import { useState } from "react";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
import { SelectField } from "../../dimensoes/fields";
export function PayableDimensionFields({
  options,
}: {
  options: DimensionOptions;
}) {
  const [nature, setNature] = useState("");
  const [unit, setUnit] = useState("");
  const [project, setProject] = useState("");
  const eligible = (items: DimensionOptions["centers"]) =>
    items.filter(
      (item) => item.active !== false && item.acceptsEntries !== false,
    );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-semibold">
        Plano de contas
        <select
          className="input mt-1 w-full"
          name="chartAccountId"
          defaultValue=""
          onChange={(event) => {
            const selected = options.accounts.find(
              (item) => item.id === event.target.value,
            );
            setNature(selected?.defaultNatureId ?? "");
          }}
        >
          <option value="">Selecione</option>
          {eligible(options.accounts).map((item) => (
            <option key={item.id} value={item.id}>
              {item.code} — {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold">
        Natureza financeira
        <select
          className="input mt-1 w-full"
          name="financialNatureId"
          value={nature}
          onChange={(event) => setNature(event.target.value)}
        >
          <option value="">Selecione</option>
          {eligible(options.natures)
            .filter(
              (item) =>
                item.type !== "TRANSFERENCIA" && item.movement !== "ENTRADA",
            )
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.code} — {item.name}
              </option>
            ))}
        </select>
      </label>
      <SelectField
        label="Centro de custo"
        name="costCenterId"
        options={eligible(options.centers)}
      />
      <label className="text-sm font-semibold">
        Unidade
        <select
          className="input mt-1 w-full"
          name="unitId"
          value={unit}
          onChange={(event) => {
            setUnit(event.target.value);
            setProject("");
          }}
        >
          <option value="">Selecione</option>
          {eligible(options.units).map((item) => (
            <option key={item.id} value={item.id}>
              {item.code} — {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold">
        Projeto
        <select
          className="input mt-1 w-full"
          name="projectId"
          value={project}
          onChange={(event) => setProject(event.target.value)}
        >
          <option value="">Selecione</option>
          {eligible(options.projects)
            .filter(
              (item) =>
                item.status !== "CONCLUIDO" &&
                item.status !== "CANCELADO" &&
                (!unit || !item.unitId || String(item.unitId) === unit),
            )
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.code} — {item.name}
              </option>
            ))}
        </select>
      </label>
    </div>
  );
}
