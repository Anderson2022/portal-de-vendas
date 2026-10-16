"use client";
import { HistoryPanel } from "../dimensoes/history-panel";
import { RegisterEditor } from "../dimensoes/register-editor";
import { UnitForm } from "./form";
import { saveUnit } from "@/lib/financeiro/unidades/save";
import type { Unit } from "@/lib/financeiro/unidades/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function UnitScreen({
  rows,
  options,
}: {
  rows: Unit[];
  options: DimensionOptions;
}) {
  return (
    <RegisterEditor
      title="Unidades"
      rows={rows}
      save={saveUnit}
      extra={(row) => (
        <>
          <HistoryPanel route="unidades" id={row.id} />
        </>
      )}
      form={(row) => <UnitForm row={row} options={options} />}
    />
  );
}
