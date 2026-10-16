import type { Unit } from "@/lib/financeiro/unidades/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
import { UnitSection1 } from "./form-section-1";
import { UnitSection2 } from "./form-section-2";
import { UnitSection3 } from "./form-section-3";
export function UnitForm({
  row,
  options,
}: {
  row: Unit | null;
  options: DimensionOptions;
}) {
  return (
    <>
      <p className="text-sm text-slate-500">Empresa: {options.company.name}</p>
      <UnitSection1 row={row} options={options} />
      <UnitSection2 row={row} options={options} />
      <UnitSection3 row={row} options={options} />
    </>
  );
}
