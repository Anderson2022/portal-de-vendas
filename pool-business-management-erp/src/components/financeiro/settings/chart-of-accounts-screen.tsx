"use client";
import type { ChartLookups } from "@/lib/financeiro/plano-contas/lookup-types";
import { ChartLookupProvider } from "./plano-contas/chart-lookup-context";
import { useState } from "react";
import { Save } from "lucide-react";
import { PageIntro } from "@/components/ui";
import { Button } from "@/components/ui/button";
import type {
  ChartAccountDetail,
  ChartAccountRow,
} from "@/lib/financeiro/plano-contas/types";
import { ChartAccountFormTabs } from "./plano-contas/chart-account-form-tabs";
import { ChartAccountSummary } from "./plano-contas/chart-account-summary";
import { ChartAccountChildren } from "./plano-contas/chart-account-children";
import { DeleteChartAccountButton } from "./plano-contas/delete-chart-account-button";
import {
  chartAccountsPath,
  useChartAccountForm,
} from "./plano-contas/use-chart-account-form";

export function ChartOfAccountsScreen({
  account,
  childAccounts = [],
  lookups,
}: {
  account?: ChartAccountDetail;
  lookups: ChartLookups;
  childAccounts?: ChartAccountRow[];
}) {
  const { pending, error, save, remove, cancel } = useChartAccountForm(account);
  const [revision, setRevision] = useState(0);
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageIntro
        crumbs={[
          { label: "Configurações", href: "/ajustes" },
          { label: "Financeiro", href: "/ajustes/financeiro" },
          { label: "Plano de Contas", href: chartAccountsPath },
        ]}
        title={
          account ? "Editar Plano de Contas" : "Cadastro de Plano de Contas"
        }
        subtitle="Cadastre e gerencie as contas contábeis da sua empresa."
      />
      <form
        className="mt-5"
        onSubmit={async (event) => {
          event.preventDefault();
          const submitter = (event.nativeEvent as SubmitEvent).submitter;
          const saveAndNew =
            submitter instanceof HTMLButtonElement && submitter.value === "new";
          if (
            (await save(new FormData(event.currentTarget), saveAndNew)) &&
            saveAndNew &&
            !account
          )
            setRevision((value) => value + 1);
        }}
      >
        <ChartLookupProvider
          key={`${account?.id ?? "new"}-${revision}`}
          account={account}
          lookups={lookups}
        >
          <fieldset disabled={pending}>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
              <ChartAccountFormTabs
                key={`${account?.id ?? "new"}-${revision}`}
                account={account}
              />
              <ChartAccountSummary
                account={account}
                childAccounts={childAccounts}
              />
            </div>
            <ChartAccountChildren rows={childAccounts} />
          </fieldset>
        </ChartLookupProvider>
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {error}
          </p>
        )}
        <footer className="mt-4 flex flex-wrap justify-between gap-4">
          {account ? (
            <DeleteChartAccountButton
              name={account.name}
              hasLinks={account.hasLinks}
              pending={pending}
              onDelete={remove}
            />
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button disabled={pending} onClick={cancel}>
              Cancelar
            </Button>
            <Button type="submit" value="new" disabled={pending}>
              Salvar e novo
            </Button>
            <Button type="submit" variant="primary" disabled={pending}>
              <Save size={16} />
              {pending ? "Aguarde..." : "Salvar"}
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
}
