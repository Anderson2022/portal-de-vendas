import type { FiscalSettings } from "@/lib/financeiro/plano-contas/fiscal-settings";
import { ChartAccountLookupField as FinancialLookupField } from "./chart-account-lookup-field";
import { Field, Switch } from "./chart-account-inputs";

export function ChartAccountFiscal({ values }: { values?: FiscalSettings }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <FinancialLookupField label="Conta referencial" name="referenceAccount" />
      <FinancialLookupField
        label="Classificação SPED"
        name="spedClassification"
      />
      <Field
        label="Código SPED"
        name="spedCode"
        defaultValue={values?.spedCode ?? ""}
        maxLength={60}
      />
      <FinancialLookupField label="Demonstrativo" name="statement" />
      <FinancialLookupField
        label="Grupo do demonstrativo"
        name="statementGroup"
      />
      <FinancialLookupField
        label="Conta de encerramento"
        name="closingAccount"
      />
      <FinancialLookupField label="Natureza fiscal" name="fiscalNature" />
      <FinancialLookupField label="Tipo de resultado" name="resultType" />
      <div className="flex items-center gap-5">
        <Switch
          label="Aceita lançamento manual"
          name="manualEntries"
          checked={values?.manualEntries}
        />
        <Switch
          label="Conta de compensação"
          name="compensation"
          checked={values?.compensation}
        />
      </div>
    </div>
  );
}
