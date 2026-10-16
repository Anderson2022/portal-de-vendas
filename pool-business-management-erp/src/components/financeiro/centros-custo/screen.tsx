"use client";
import { CostCenterBudgetPanel } from "./budget-panel";
import { CenterEntriesPanel } from "./entries-panel";
import { HistoryPanel } from "../dimensoes/history-panel";
import { RegisterEditor } from "../dimensoes/register-editor";
import { CostCenterForm } from "./form";
import { saveCostCenter } from "@/lib/financeiro/centros-custo/save";
import type { CostCenter } from "@/lib/financeiro/centros-custo/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function CostCenterScreen({
  rows,
  options,
}: {
  rows: CostCenter[];
  options: DimensionOptions;
}) {
  return (
    <RegisterEditor
      title="Centros de custo"
      rows={rows}
      save={saveCostCenter}
      extra={(row) => (
        <>
          <CostCenterBudgetPanel id={row.id} options={options} />
          <CenterEntriesPanel id={row.id} />
          <HistoryPanel route="centros-custo" id={row.id} />
        </>
      )}
      form={(row) => <CostCenterForm row={row} options={options} />}
    />
  );
}
