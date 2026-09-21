import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filterLookup } from "./lookup-config";
import type { LookupRecord } from "./lookup-types";

export function LookupResults({ records, query, onQuery, onSelect, onCreate }: {
  records: LookupRecord[]; query: string; onQuery: (query: string) => void;
  onSelect: (record: LookupRecord) => void; onCreate: () => void;
}) {
  const filtered = filterLookup(records, query);
  return (
    <div className="space-y-4">
      <Input autoFocus type="search" aria-label="Pesquisar registros" placeholder="Digite o nome ou código..." value={query}
        onChange={(event) => onQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") { event.preventDefault(); if (filtered.length === 1) onSelect(filtered[0]); }
        }} />
      <p role="status" className="text-xs text-ink-500">{filtered.length} registro(s) encontrado(s)</p>
      <div className="max-h-72 space-y-2 overflow-y-auto">
        {filtered.map((record) => (
          <Button key={record.id} className="w-full !justify-between text-left" onClick={() => onSelect(record)}>
            <span>{record.name}{record.value !== record.name && <span className="ml-2 text-xs text-ink-500">{record.value}</span>}</span>
            <span className="text-xs">Selecionar</span>
          </Button>
        ))}
        {filtered.length === 0 && <p className="rounded-xl border border-dashed border-ink-300 p-5 text-sm text-ink-500">Nenhum registro encontrado. Você pode cadastrar um novo abaixo.</p>}
      </div>
      <Button variant="primary" onClick={onCreate}><Plus size={16} />Novo cadastro</Button>
    </div>
  );
}
