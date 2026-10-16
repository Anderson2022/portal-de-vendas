import type { AccountNotes } from "@/lib/financeiro/plano-contas/account-notes";
import { ChartAccountLookupField as FinancialLookupField } from "./chart-account-lookup-field";
import { Area, Field } from "./chart-account-inputs";

export function ChartAccountNotes({ values }: { values?: AccountNotes }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Area
        label="Observação geral"
        name="notes"
        defaultValue={values?.notes ?? ""}
      />
      <Area
        label="Instrução de lançamento"
        name="entryInstructions"
        defaultValue={values?.entryInstructions ?? ""}
      />
      <Area
        label="Observação contábil"
        name="accountingNotes"
        defaultValue={values?.accountingNotes ?? ""}
      />
      <Area
        label="Observação fiscal"
        name="fiscalNotes"
        defaultValue={values?.fiscalNotes ?? ""}
      />
      <FinancialLookupField
        label="Usuário responsável"
        name="responsibleUser"
      />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Data de vigência"
          name="startDate"
          defaultValue={values?.startDate ?? ""}
          type="date"
        />
        <Field
          label="Data final"
          name="endDate"
          defaultValue={values?.endDate ?? ""}
          type="date"
        />
      </div>
    </div>
  );
}
