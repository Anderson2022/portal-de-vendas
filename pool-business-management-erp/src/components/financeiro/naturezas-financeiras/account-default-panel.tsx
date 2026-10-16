"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { SelectField } from "../dimensoes/fields";
import { saveAccountNature } from "@/lib/financeiro/naturezas-financeiras/save-account-default";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function AccountDefaultPanel({
  options,
}: {
  options: DimensionOptions;
}) {
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const selected = options.accounts.find((item) => item.id === account);
  return (
    <Card className="mt-5 p-5">
      <h2 className="font-bold">Natureza sugerida pelo plano de contas</h2>
      <p className="mt-1 text-sm text-slate-500">
        Ao classificar o lançamento, a natureza será sugerida automaticamente.
      </p>
      <form
        className="mt-4 grid gap-4 md:grid-cols-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          setPending(true);
          setMessage("");
          try {
            const result = await saveAccountNature(
              account,
              String(form.get("natureId") || ""),
            );
            setMessage(result.error ?? "Sugestão salva.");
            if (!result.error) router.refresh();
          } catch {
            setMessage("Não foi possível salvar.");
          } finally {
            setPending(false);
          }
        }}
      >
        <label className="text-sm font-semibold">
          Plano de contas
          <select
            className="input mt-1 w-full"
            required
            value={account}
            onChange={(event) => setAccount(event.target.value)}
          >
            <option value="">Selecione</option>
            {options.accounts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.code} — {item.name}
              </option>
            ))}
          </select>
        </label>
        <SelectField
          key={`${account}:${selected?.defaultNatureId}`}
          label="Natureza padrão"
          name="natureId"
          value={selected?.defaultNatureId}
          options={options.natures.filter(
            (item) => item.active && item.acceptsEntries,
          )}
        />
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Salvando…" : "Salvar sugestão"}
        </Button>
      </form>
      {message && (
        <p role="status" className="mt-3 text-sm">
          {message}
        </p>
      )}
    </Card>
  );
}
