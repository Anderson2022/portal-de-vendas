import type { CostCenter } from "@/lib/financeiro/centros-custo/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
import { CostCenterSection1 } from "./form-section-1";
import { CostCenterSection2 } from "./form-section-2";
import { CostCenterSection3 } from "./form-section-3";
export function CostCenterForm({
  row,
  options,
}: {
  row: CostCenter | null;
  options: DimensionOptions;
}) {
  return (
    <>
      <p className="text-sm text-slate-500">Empresa: {options.company.name}</p>
      <CostCenterSection1 row={row} options={options} />
      <CostCenterSection2 row={row} options={options} />
      <CostCenterSection3 row={row} options={options} />
    </>
  );
}
