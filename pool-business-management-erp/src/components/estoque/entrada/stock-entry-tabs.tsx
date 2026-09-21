"use client";

import type { StockEntryTab } from "./stock-entry-types";

const tabs: { id: StockEntryTab; label: string }[] = [
  { id: "PRINCIPAL", label: "Principal" },
  { id: "OUTROS_DADOS", label: "Outros Dados" },
  { id: "OBSERVACOES", label: "Observações" },
  { id: "IMAGENS", label: "Imagens" },
  { id: "ANEXOS", label: "Anexos" },
];

type Props = {
  active: StockEntryTab;
  onChange: (tab: StockEntryTab) => void;
};

export function StockEntryTabs({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-black/[0.035] p-1.5">
      {tabs.map((tab) => {
        const selected = active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              "rounded-xl px-4 py-2 text-[12px] font-bold transition-all",
              selected
                ? "bg-white text-ink-900 shadow-[0_6px_16px_rgba(15,23,42,0.10)]"
                : "text-ink-400 hover:text-ink-700",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
