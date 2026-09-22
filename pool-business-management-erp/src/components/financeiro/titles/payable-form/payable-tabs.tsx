import type { PayableTab } from "./payable-form-types";

const tabs: Array<{ id: PayableTab; label: string; hint: string }> = [
  { id: "title", label: "Dados do título", hint: "Informações gerais" },
  { id: "values", label: "Valores e parcelas", hint: "Vencimento e condições" },
  {
    id: "classification",
    label: "Classificação",
    hint: "Plano de contas e rateio",
  },
  { id: "payment", label: "Pagamento", hint: "Conta e forma prevista" },
  { id: "documents", label: "Documentos", hint: "Anexos e observações" },
];

export function PayableTabs({
  active,
  onChange,
}: {
  active: PayableTab;
  onChange: (tab: PayableTab) => void;
}) {
  return (
    <nav className="grid shrink-0 grid-cols-2 gap-2 border-b border-slate-200 bg-slate-50 p-3 md:grid-cols-5">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-xl px-3 py-2 text-left transition ${
            active === tab.id
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-blue-50"
          }`}
        >
          <span className="mr-2 inline-flex size-7 items-center justify-center rounded-full bg-black/5 font-bold">
            {index + 1}
          </span>
          <span className="text-sm font-bold">{tab.label}</span>
          <small className="mt-1 hidden pl-9 opacity-75 xl:block">
            {tab.hint}
          </small>
        </button>
      ))}
    </nav>
  );
}
