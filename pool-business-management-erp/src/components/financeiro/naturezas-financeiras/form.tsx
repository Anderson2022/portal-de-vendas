import type { FinancialNature } from "@/lib/financeiro/naturezas-financeiras/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
import { FinancialNatureSection1 } from "./form-section-1";
import { FinancialNatureSection2 } from "./form-section-2";
import { FinancialNatureSection3 } from "./form-section-3";
export function FinancialNatureForm({
  row,
  options,
}: {
  row: FinancialNature | null;
  options: DimensionOptions;
}) {
  return (
    <>
      <p className="text-sm text-slate-500">Empresa: {options.company.name}</p>
      <FinancialNatureSection1 row={row} options={options} />
      <FinancialNatureSection2 row={row} options={options} />
      <FinancialNatureSection3 row={row} options={options} />
    </>
  );
}
