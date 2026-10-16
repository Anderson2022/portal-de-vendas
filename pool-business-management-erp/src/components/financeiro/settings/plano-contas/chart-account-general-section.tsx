import { ChartAccountLookupField as FinancialLookupField } from "./chart-account-lookup-field";
import { useChartLookups } from "./chart-lookup-context";
import { Field, Switch } from "./chart-account-inputs";
import type { ChartAccountDetail } from "@/lib/financeiro/plano-contas/types";

export function ChartAccountGeneral({
  account,
}: {
  account?: ChartAccountDetail;
}) {
  const { code, setCode, lookups, selected } = useChartLookups();
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_2fr]">
        <Field
          label="Código da conta *"
          name="code"
          defaultValue={account?.code}
          onChange={(event) => setCode(event.target.value)}
        />
        <Field
          label="Código reduzido *"
          name="shortCode"
          defaultValue={account?.shortCode}
          maxLength={20}
        />
        <Field
          label="Descrição / Nome da conta *"
          name="name"
          defaultValue={account?.name}
          maxLength={180}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <FinancialLookupField label="Conta pai" name="parentAccount" />
        <FinancialLookupField
          label="Grupo"
          name="accountGroup"

          required
        />
        <FinancialLookupField label="Subgrupo" name="accountSubgroup" />
        <FinancialLookupField
          label="Tipo da conta"
          name="accountType"

          required
        />
        <FinancialLookupField
          label="Natureza"
          name="accountNature"

          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field
          label="Nível"
          name="level"
          value={code ? String(code.split(".").length) : ""}
          readOnly
        />
        <Field
          label="Classificação"
          name="classification"
          value={
            lookups.accountType.options.find(
              (option) => option.id === selected.accountType,
            )?.name ?? ""
          }
          readOnly
        />
        <div className="flex flex-wrap items-end gap-5 pb-3">
          <Switch
            label="Ativa"
            name="active"
            checked={account?.active ?? true}
          />
          <Switch
            label="Aceita lançamento"
            name="acceptsEntries"
            checked={account?.acceptsEntries ?? true}
          />
          <Switch
            label="Permite centro de custo"
            name="allowsCostCenter"
            checked={account?.allowsCostCenter}
          />
          <Switch
            label="Exige histórico"
            name="requiresHistory"
            checked={account?.requiresHistory}
          />
        </div>
      </div>
    </div>
  );
}
