"use client";
import { AccountDefaultPanel } from "./account-default-panel";
import { HistoryPanel } from "../dimensoes/history-panel";
import { RegisterEditor } from "../dimensoes/register-editor";
import { FinancialNatureForm } from "./form";
import { saveFinancialNature } from "@/lib/financeiro/naturezas-financeiras/save";
import type { FinancialNature } from "@/lib/financeiro/naturezas-financeiras/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function FinancialNatureScreen({
  rows,
  options,
}: {
  rows: FinancialNature[];
  options: DimensionOptions;
}) {
  return (
    <>
      <RegisterEditor
        title="Naturezas financeiras"
        rows={rows}
        save={saveFinancialNature}
        extra={(row) => (
          <>
            <HistoryPanel route="naturezas-financeiras" id={row.id} />
          </>
        )}
        form={(row) => <FinancialNatureForm row={row} options={options} />}
      />
      <AccountDefaultPanel options={options} />
    </>
  );
}
