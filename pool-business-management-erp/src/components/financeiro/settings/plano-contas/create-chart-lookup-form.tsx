"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createChartLookup } from "@/lib/financeiro/plano-contas/create-chart-lookup";
import type { LookupOption } from "@/lib/financeiro/plano-contas/lookup-types";
export function CreateChartLookupForm({
  lookupKey,
  parentId,
  onCreated,
}: {
  lookupKey: string;
  parentId?: string;
  onCreated: (option: LookupOption) => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function create() {
    if (!code.trim() || !name.trim()) {
      setError("Informe código e descrição.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const result = await createChartLookup(
        lookupKey,
        code.trim(),
        name.trim(),
        parentId,
      );
      if (result.error) setError(result.error);
      else if (result.option) onCreated(result.option);
    } catch {
      setError("Não foi possível cadastrar. Tente novamente.");
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="space-y-3 border-t pt-4">
      <h3 className="font-bold">Novo registro</h3>
      <label className="block text-sm">
        Código
        <input
          className="input mt-1 w-full"
          value={code}
          maxLength={30}
          onChange={(event) => setCode(event.target.value)}
          disabled={pending}
        />
      </label>
      <label className="block text-sm">
        Descrição
        <input
          className="input mt-1 w-full"
          value={name}
          maxLength={150}
          onChange={(event) => setName(event.target.value)}
          disabled={pending}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <Button variant="primary" onClick={create} disabled={pending}>
          {pending ? "Cadastrando..." : "Cadastrar e selecionar"}
        </Button>
      </div>
    </div>
  );
}
