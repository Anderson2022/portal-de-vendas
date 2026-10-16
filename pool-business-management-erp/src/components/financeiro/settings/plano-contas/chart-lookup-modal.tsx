"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { LookupOption } from "@/lib/financeiro/plano-contas/lookup-types";
import { CreateChartLookupForm } from "./create-chart-lookup-form";
export function ChartLookupModal({
  label,
  lookupKey,
  options,
  canCreate,
  parentId,
  onSelect,
  onCreated,
  onClose,
}: {
  label: string;
  lookupKey: string;
  options: LookupOption[];
  canCreate: boolean;
  parentId?: string;
  onSelect: (id: string) => void;
  onCreated: (option: LookupOption) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const filtered = options.filter((option) =>
    `${option.code} ${option.name}`
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase()),
  );
  return (
    <Modal open title={`Pesquisar ${label}`} width="max-w-xl" onClose={onClose}>
      <div
        className="space-y-4 pt-4"
        onKeyDown={(event) => {
          if (event.key === "Enter") event.preventDefault();
        }}
      >
        <input
          aria-label={`Filtrar ${label}`}
          className="input w-full"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar por código ou descrição"
          autoFocus
        />
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {filtered.map((option) => (
            <button
              key={option.id}
              type="button"
              className="w-full rounded-xl border border-black/5 p-3 text-left hover:bg-water-50"
              onClick={() => onSelect(option.id)}
            >
              {option.code} — {option.name}
              {!option.active && " (Inativo)"}
            </button>
          ))}
          {!filtered.length && (
            <p className="py-4 text-center text-sm text-ink-500">
              Nenhum registro encontrado.
            </p>
          )}
        </div>
        {canCreate && (
          <Button onClick={() => setCreating((value) => !value)}>
            {creating ? "Fechar cadastro" : "+ Cadastrar"}
          </Button>
        )}
        {creating && (
          <CreateChartLookupForm
            lookupKey={lookupKey}
            parentId={parentId}
            onCreated={onCreated}
          />
        )}
      </div>
    </Modal>
  );
}
