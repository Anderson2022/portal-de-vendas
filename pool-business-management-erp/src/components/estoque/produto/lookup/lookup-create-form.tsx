import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { lookupConfig } from "./lookup-config";
import type { LookupInput, LookupKind } from "./lookup-types";

export function LookupCreateForm({ kind, initialName, onSave, onBack, onBusy }: {
  kind: LookupKind; initialName: string; onSave: (input: LookupInput) => Promise<void>;
  onBack: () => void; onBusy: (busy: boolean) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const config = lookupConfig[kind];
  return (
    <form className="space-y-4" onSubmit={async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (pending) return;
      const data = new FormData(event.currentTarget);
      setPending(true); onBusy(true); setError("");
      try {
        await onSave(Object.fromEntries(data) as LookupInput);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Não foi possível cadastrar. Tente novamente.");
      } finally { setPending(false); onBusy(false); }
    }}>
      {error && <Notice error>{error}</Notice>}
      <fieldset disabled={pending} className="space-y-4">
        {config.code && <Field label="Código / sigla"><Input autoFocus name="code" required maxLength={20} placeholder="Ex.: UN" /></Field>}
        <Field label={config.numeric ? "Valor" : "Nome"}>
          <Input autoFocus={!config.code} name="name" required maxLength={100}
            type={config.numeric ? "number" : "text"} min={config.min} step={config.step}
            defaultValue={config.numeric && !Number.isFinite(Number(initialName)) ? "" : initialName} />
        </Field>
        {kind === "supplier" && <>
          <Field label="CPF / CNPJ"><Input name="documentNumber" /></Field>
          <Field label="Telefone"><Input name="phone" type="tel" /></Field>
          <Field label="E-mail"><Input name="email" type="email" /></Field>
        </>}
      </fieldset>
      <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
        <Button disabled={pending} onClick={onBack}>Voltar à pesquisa</Button>
        <Button type="submit" variant="primary" disabled={pending}>{pending ? "Salvando..." : config.remote ? "Salvar e selecionar" : "Adicionar à ficha e selecionar"}</Button>
      </div>
    </form>
  );
}
