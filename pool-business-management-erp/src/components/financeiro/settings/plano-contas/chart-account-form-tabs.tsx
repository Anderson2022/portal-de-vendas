"use client";
import { useState } from "react";
import type { ChartAccountDetail } from "@/lib/financeiro/plano-contas/types";
import { Card } from "@/components/ui";
import { ChartAccountGeneral } from "./chart-account-general-section";
import { ChartAccountFiscal } from "./chart-account-fiscal-section";
import { ChartAccountIntegrations } from "./chart-account-integrations-section";
import { ChartAccountNotes } from "./chart-account-notes-section";
const tabs = [
  "Dados Gerais",
  "Contábil e Fiscal",
  "Integrações",
  "Observações",
];
export function ChartAccountFormTabs({
  account,
}: {
  account?: ChartAccountDetail;
}) {
  const [tab, setTab] = useState(0);
  return (
    <Card className="overflow-hidden">
      <nav
        className="flex overflow-x-auto border-b"
        aria-label="Abas do plano de contas"
      >
        {tabs.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setTab(index)}
            aria-current={tab === index ? "page" : undefined}
            className={`px-6 py-4 text-sm font-bold ${tab === index ? "border-b-2 border-blue-600 text-blue-700" : "text-ink-500"}`}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="p-5">
        <div hidden={tab !== 0}>
          <ChartAccountGeneral account={account} />
        </div>
        <fieldset hidden={tab !== 1}>
          <ChartAccountFiscal values={account?.fiscal} />
        </fieldset>
        <fieldset hidden={tab !== 2}>
          <ChartAccountIntegrations values={account?.integrations} />
        </fieldset>
        <fieldset hidden={tab !== 3}>
          <ChartAccountNotes values={account?.notes} />
        </fieldset>
      </div>
    </Card>
  );
}
