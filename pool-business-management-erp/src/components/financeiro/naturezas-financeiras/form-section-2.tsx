import { useState } from "react";
import {
  Section,
  Field,
  Check,
  SelectField,
  choices,
} from "../dimensoes/fields";
import type { FinancialNature } from "@/lib/financeiro/naturezas-financeiras/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function FinancialNatureSection2({
  row,
}: {
  row: FinancialNature | null;
  options: DimensionOptions;
}) {
  const [type, setType] = useState(row?.type ?? "DESPESA");
  const [movement, setMovement] = useState(row?.movement ?? "SAIDA");
  const [dre, setDre] = useState(row?.affectsDre ?? true);
  const [result, setResult] = useState(row?.affectsResult ?? true);
  const transfer = type === "TRANSFERENCIA";
  return (
    <Section title="Classificação e impactos">
      <label className="text-sm font-semibold">
        Tipo *
        <select
          className="input mt-1 w-full"
          name="type"
          value={type}
          onChange={(event) => {
            const next = event.target.value;
            setType(next);
            if (next === "TRANSFERENCIA") {
              setMovement("AMBOS");
              setDre(false);
              setResult(false);
            } else {
              setMovement(next === "RECEITA" ? "ENTRADA" : "SAIDA");
            }
          }}
        >
          {choices(
            "RECEITA:Receita|DESPESA:Despesa|TRANSFERENCIA:Transferência|AJUSTE:Ajuste|INVESTIMENTO:Investimento|FINANCIAMENTO:Financiamento",
          ).map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <SelectField
        label="Grupo"
        name="group"
        value={row?.group ?? "OPERACIONAL"}
        options={choices(
          "OPERACIONAL:Operacional|ADMINISTRATIVO:Administrativo|COMERCIAL:Comercial|FINANCEIRO:Financeiro|INVESTIMENTO:Investimento|FINANCIAMENTO:Financiamento|OUTROS:Outros",
        )}
        required
      />
      <label className="text-sm font-semibold">
        Entrada ou saída *
        <select
          className="input mt-1 w-full"
          name="movement"
          value={movement}
          onChange={(event) => setMovement(event.target.value)}
        >
          {choices(
            transfer
              ? "AMBOS:Ambos"
              : "ENTRADA:Entrada|SAIDA:Saída|AMBOS:Ambos",
          ).map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <Check
        label="Impacta fluxo de caixa"
        name="affectsCashFlow"
        value={row?.affectsCashFlow ?? true}
      />
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          name="affectsDre"
          checked={dre}
          disabled={transfer}
          onChange={(event) => setDre(event.target.checked)}
        />
        Impacta DRE
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          name="affectsResult"
          checked={result}
          disabled={transfer}
          onChange={(event) => setResult(event.target.checked)}
        />
        Impacta resultado
      </label>
      {transfer && (
        <p className="text-sm text-slate-500 md:col-span-2">
          Transferências movimentam contas sem gerar receita ou despesa no
          resultado.
        </p>
      )}
      <Check
        label="Permitir lançamentos financeiros"
        name="acceptsEntries"
        value={row?.acceptsEntries ?? true}
      />
      <Field
        label="Ordem de exibição"
        name="displayOrder"
        value={row?.displayOrder ?? 0}
        type="number"
      />
      <Field label="Cor" name="color" value={row?.color} />
      <Field label="Ícone" name="icon" value={row?.icon} />
      <Check label="Ativo" name="active" value={row?.active ?? true} />
    </Section>
  );
}
