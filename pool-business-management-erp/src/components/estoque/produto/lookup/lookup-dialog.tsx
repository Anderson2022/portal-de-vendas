import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { lookupConfig } from "./lookup-config";
import { LookupCreateForm } from "./lookup-create-form";
import { LookupResults } from "./lookup-results";
import { useProductLookup } from "./product-lookup-provider";
import type { LookupKind, LookupRecord } from "./lookup-types";

export function LookupDialog({ kind, label, initialMode, onSelect, onClose }: {
  kind: LookupKind; label: string; initialMode: "search" | "create";
  onSelect: (record: LookupRecord) => void; onClose: () => void;
}) {
  const [mode, setMode] = useState(initialMode);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const lookup = useProductLookup();
  useEffect(() => { void lookup.refresh(kind); }, [kind]);
  return (
    <div onKeyDown={(event) => event.stopPropagation()}>
      <Modal open title={`${mode === "search" ? "Pesquisar" : "Cadastrar"} ${label}`} width="max-w-2xl" onClose={() => { if (!busy) onClose(); }}>
        <p className="mb-4 rounded-xl bg-water-50 px-3 py-2 text-xs leading-relaxed text-ink-500">
          {lookupConfig[kind].remote ? "Os registros são consultados e cadastrados no sistema."
            : kind === "unit" ? "As unidades são compartilhadas nesta ficha. A unidade principal é salva no produto; as demais entram na exportação."
            : "Estas opções ficam disponíveis nesta ficha e na exportação. O cadastro permanente ainda depende de integração."}
        </p>
        {mode === "search" ? <LookupResults records={lookup.records(kind)} query={query} onQuery={setQuery} onSelect={onSelect} onCreate={() => setMode("create")} />
          : <LookupCreateForm kind={kind} initialName={query} onBack={() => setMode("search")} onBusy={setBusy}
            onSave={async (input) => { const record = await lookup.create(kind, input); onSelect(record); }} />}
      </Modal>
    </div>
  );
}
