"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, PageIntro } from "@/components/ui";
import { FinancialLookupField } from "./financial-lookup-field";
import {
  CHART_ACCOUNTS_KEY,
  type ChartAccountRow,
} from "./chart-of-accounts-list";
const tabs = [
  "Dados Gerais",
  "Contábil e Fiscal",
  "Integrações",
  "Observações",
] as const;
function Switch({
  label,
  name,
  checked = false,
}: {
  label: string;
  name: string;
  checked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-bold">
      <input type="checkbox" name={name} defaultChecked={checked} />
      {label}
    </label>
  );
}
export function ChartOfAccountsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Dados Gerais");
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageIntro
        crumbs={[
          { label: "Configurações", href: "/ajustes" },
          { label: "Financeiro", href: "/ajustes/financeiro" },
          { label: "Plano de Contas" },
        ]}
        title="Cadastro de Plano de Contas"
        subtitle="Cadastre e gerencie as contas contábeis da sua empresa."
      />
      <form
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const rows = JSON.parse(
            localStorage.getItem(CHART_ACCOUNTS_KEY) || "[]",
          ) as ChartAccountRow[];
          rows.push({
            id: crypto.randomUUID(),
            code: String(data.get("code") || ""),
            shortCode: String(data.get("shortCode") || ""),
            name: String(data.get("name") || ""),
            active: Boolean(data.get("active")),
            parentName: String(data.get("parentAccount") || ""),
            nature: String(data.get("accountNature") || ""),
            accountType: String(data.get("accountType") || ""),
          });
          localStorage.setItem(CHART_ACCOUNTS_KEY, JSON.stringify(rows));
          router.push("/ajustes/financeiro/categoria-plano-contas");
        }}
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <Card className="overflow-hidden">
            <nav className="flex overflow-x-auto border-b">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`px-6 py-4 text-sm font-bold ${tab === item ? "border-b-2 border-blue-600 text-blue-700" : "text-ink-500"}`}
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="p-5">
              {tab === "Dados Gerais" && (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-[1fr_1fr_2fr]">
                    <Field label="Código da conta *" name="code" />
                    <Field label="Código reduzido *" name="shortCode" />
                    <Field label="Descrição / Nome da conta *" name="name" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
                    <FinancialLookupField
                      label="Conta pai"
                      name="parentAccount"
                    />
                    <FinancialLookupField
                      label="Grupo"
                      name="accountGroup"
                      required
                    />
                    <FinancialLookupField
                      label="Subgrupo"
                      name="accountSubgroup"
                    />
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
                    <Field label="Nível" name="level" readOnly />
                    <Field
                      label="Classificação"
                      name="classification"
                      readOnly
                    />
                    <div className="flex flex-wrap items-end gap-5 pb-3">
                      <Switch label="Ativa" name="active" checked />
                      <Switch
                        label="Aceita lançamento"
                        name="acceptsEntries"
                        checked
                      />
                      <Switch
                        label="Permite centro de custo"
                        name="allowsCostCenter"
                      />
                      <Switch label="Exige histórico" name="requiresHistory" />
                    </div>
                  </div>
                </div>
              )}
              {tab === "Contábil e Fiscal" && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <FinancialLookupField
                    label="Conta referencial"
                    name="referenceAccount"
                  />
                  <FinancialLookupField
                    label="Classificação SPED"
                    name="spedClassification"
                  />
                  <Field label="Código SPED" name="spedCode" />
                  <FinancialLookupField
                    label="Demonstrativo"
                    name="statement"
                  />
                  <FinancialLookupField
                    label="Grupo do demonstrativo"
                    name="statementGroup"
                  />
                  <FinancialLookupField
                    label="Conta de encerramento"
                    name="closingAccount"
                  />
                  <FinancialLookupField
                    label="Natureza fiscal"
                    name="fiscalNature"
                  />
                  <FinancialLookupField
                    label="Tipo de resultado"
                    name="resultType"
                  />
                  <div className="flex items-center gap-5">
                    <Switch
                      label="Aceita lançamento manual"
                      name="manualEntries"
                    />
                    <Switch label="Conta de compensação" name="compensation" />
                  </div>
                </div>
              )}
              {tab === "Integrações" && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <FinancialLookupField
                    label="Empresa"
                    name="company"
                    required
                  />
                  <FinancialLookupField label="Filial" name="branch" />
                  <FinancialLookupField
                    label="Conta bancária"
                    name="bankAccount"
                  />
                  <FinancialLookupField
                    label="Centro de custo padrão"
                    name="defaultCostCenter"
                  />
                  <FinancialLookupField
                    label="Projeto padrão"
                    name="defaultProject"
                  />
                  <FinancialLookupField
                    label="Integração externa"
                    name="externalIntegration"
                  />
                  <FinancialLookupField
                    label="Conta externa"
                    name="externalAccount"
                  />
                  <Field label="Código externo" name="externalCode" />
                  <Switch label="Sincroniza automaticamente" name="autoSync" />
                </div>
              )}
              {tab === "Observações" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Area label="Observação geral" name="notes" />
                  <Area
                    label="Instrução de lançamento"
                    name="entryInstructions"
                  />
                  <Area label="Observação contábil" name="accountingNotes" />
                  <Area label="Observação fiscal" name="fiscalNotes" />
                  <FinancialLookupField
                    label="Usuário responsável"
                    name="responsibleUser"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Data de vigência"
                      name="startDate"
                      type="date"
                    />
                    <Field label="Data final" name="endDate" type="date" />
                  </div>
                </div>
              )}
            </div>
          </Card>
          <Card className="h-fit p-5">
            <h2 className="font-extrabold">Resumo da conta</h2>
            <div className="mt-4 rounded-full bg-green-100 px-3 py-2 text-center text-sm font-bold text-green-700">
              Ativa
            </div>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-ink-500">Última alteração</dt>
                <dd className="font-bold">Novo cadastro</dd>
              </div>
              <div>
                <dt className="text-ink-500">Total de subcontas</dt>
                <dd className="font-bold">0</dd>
              </div>
              <div>
                <dt className="text-ink-500">Classificação</dt>
                <dd className="font-bold">Calculada pela hierarquia</dd>
              </div>
            </dl>
          </Card>
        </div>
        <Card className="mt-4 p-5">
          <div className="flex justify-between">
            <h2 className="font-extrabold">Contas filhas (0)</h2>
            <Button>+ Nova conta filha</Button>
          </div>
          <p className="py-8 text-center text-sm text-ink-500">
            Nenhuma conta filha cadastrada.
          </p>
        </Card>
        <footer className="mt-4 flex justify-between">
          <Button className="text-red-600">
            <Trash2 size={16} /> Excluir
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={() =>
                router.push("/ajustes/financeiro/categoria-plano-contas")
              }
            >
              Cancelar
            </Button>
            <Button>Salvar e novo</Button>
            <Button type="submit" variant="primary">
              <Save size={16} /> Salvar
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
}
function Field({
  label,
  name,
  type = "text",
  readOnly = false,
}: {
  label: string;
  name: string;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="text-sm font-bold">
      {label}
      <input
        className="input mt-1 w-full"
        name={name}
        type={type}
        readOnly={readOnly}
        required={label.includes("*")}
      />
    </label>
  );
}
function Area({ label, name }: { label: string; name: string }) {
  return (
    <label className="text-sm font-bold">
      {label}
      <textarea className="input mt-1 min-h-28 w-full" name={name} />
    </label>
  );
}
