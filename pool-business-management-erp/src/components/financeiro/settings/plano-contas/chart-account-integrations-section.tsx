import type { IntegrationSettings } from "@/lib/financeiro/plano-contas/integration-settings";
import { ChartAccountLookupField as FinancialLookupField } from "./chart-account-lookup-field";
import { Field, Switch } from "./chart-account-inputs";

export function ChartAccountIntegrations({
  values,
}: {
  values?: IntegrationSettings;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <FinancialLookupField label="Empresa" name="company" required />
      <FinancialLookupField label="Filial" name="branch" />
      <FinancialLookupField label="Conta bancária" name="bankAccount" />
      <FinancialLookupField
        label="Centro de custo padrão"
        name="defaultCostCenter"
      />
      <FinancialLookupField label="Projeto padrão" name="defaultProject" />
      <FinancialLookupField
        label="Integração externa"
        name="externalIntegration"
      />
      <FinancialLookupField label="Conta externa" name="externalAccount" />
      <Field
        label="Código externo"
        name="externalCode"
        defaultValue={values?.externalCode ?? ""}
        maxLength={100}
      />
      <Switch
        label="Sincroniza automaticamente"
        name="autoSync"
        checked={values?.autoSync}
      />
    </div>
  );
}
