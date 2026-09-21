"use client";

import { useEffect, useId, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lookupConfig } from "./lookup-config";
import { LookupDialog } from "./lookup-dialog";
import { useProductLookup } from "./product-lookup-provider";
import type { LookupKind, LookupRecord } from "./lookup-types";

export function ProductLookupField({ label, name, kind, defaultValue = "", valueMode = "value", draftName, required = false }: {

  label: string;
  name: string;
  kind: LookupKind;
  defaultValue?: string;
  
  valueMode?: "id" | "value"; draftName?: string; required?: boolean;
}) {
  const id = useId();
  const lookup = useProductLookup();
  const initialId = lookup.initial(name);
  const initialLabel = draftName ? lookup.initial(draftName) : "";
  const records = lookup.records(kind);
  const [selected, setSelected] = useState<LookupRecord | null>(() => records.find((record) => record.id === initialId || record.value === defaultValue) || (initialId ? { id: initialId, name: initialLabel, value: initialLabel, persisted: true } : null));
  const [number, setNumber] = useState(() => initialId || defaultValue);
  const [mode, setMode] = useState<"search" | "create" | null>(null);
  const config = lookupConfig[kind];
  const resolvedSelected = records.find((record) => record.id === selected?.id) || selected;
  const value = resolvedSelected ? valueMode === "id" ? resolvedSelected.persisted ? resolvedSelected.id : "" : resolvedSelected.value : "";

  useEffect(() => {
    if (config.remote) void lookup.refresh(kind);
  }, [kind]);

  
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-xs font-bold text-ink-700">{label}</label>
      {config.numeric ? <Input id={id} className="input min-w-0" name={name}
          type={config.numeric ? "number" : "text"} min={config.min} step={config.step} required={required}
          value={number}
          placeholder="0"
          onChange={(event) => setNumber(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "F2") {
              event.preventDefault(); event.stopPropagation(); setMode("search");
            }
          }} /> : <div className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] gap-2">
        <Input aria-label={`${label} ID`} className="input !w-16 min-w-0" readOnly value={resolvedSelected?.id || ""} placeholder="ID" />
        <div className="relative min-w-0 flex-1">
          <Input id={id} className="input w-full !pr-10" readOnly required={required}
            value={resolvedSelected?.name || ""} placeholder="Descrição"
            onKeyDown={(event) => { if (event.key === "F2") { event.preventDefault(); setMode("search"); } }} />
          <Button type="button" variant="unstyled" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-water-600"
            aria-label={`Pesquisar ${label}`} title="Pesquisar (F2)" onClick={() => setMode("search")}><Search size={16} /></Button>
        </div>
      </div>}
      {!config.numeric && <Input type="hidden" name={name} value={value} />}
      {draftName && <Input type="hidden" name={draftName} value={resolvedSelected?.name || ""} />}
      {kind === "warehouse" && selected && !selected.persisted && <p className="mt-1 text-xs text-ink-500">Somente na ficha; a entrada será registrada sem depósito.</p>}
      {mode && <LookupDialog kind={kind} label={label} initialMode={mode} onClose={() => setMode(null)} onSelect={(record) => {
        setSelected(record); if (config.numeric) setNumber(record.value); setMode(null);
      }} />}
    </div>
  );
}
