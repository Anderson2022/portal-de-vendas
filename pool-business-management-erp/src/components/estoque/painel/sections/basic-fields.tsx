"use client";

import { Input } from "@/components/ui/input";
import type { LookupKind, LookupRecord } from "../../produto/lookup/lookup-types";
import type {
  ProductReferenceDetails,
  SetProductReferenceDetail,
} from "../types/product-reference-form-types";

type BasicFieldsProps = {
  kind: LookupKind;
  record?: LookupRecord | null;
  name: string;
  code: string;
  details: ProductReferenceDetails;
  usesCode: boolean;
  setName: (value: string) => void;
  setCode: (value: string) => void;
  setDetail: SetProductReferenceDetail;
};

export function BasicFields({
  kind,
  record,
  name,
  code,
  details,
  usesCode,
  setName,
  setCode,
  setDetail,
}: BasicFieldsProps) {
  const nameLabel =
    kind === "category"
      ? "Nome da categoria"
      : ["unit", "type"].includes(kind)
        ? "Nome"
        : "Nome / descrição";

  return (
    <>
      {kind === "category" && !record && (
        <div className="grid gap-3 sm:col-span-2 sm:grid-cols-[180px_1fr]">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={details.automaticId}
              onChange={(event) =>
                setDetail("automaticId", event.target.checked)
              }
            />
            Gerar ID automaticamente
          </label>

          <Input
            type="number"
            min="1"
            disabled={details.automaticId}
            value={details.requestedId}
            onChange={(event) =>
              setDetail("requestedId", event.target.value)
            }
            placeholder={
              details.automaticId
                ? "ID será gerado automaticamente"
                : "Informe o ID"
            }
          />
        </div>
      )}

      {kind === "category" && !record && (
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={details.automaticCode}
            onChange={(event) =>
              setDetail("automaticCode", event.target.checked)
            }
          />
          Gerar código automaticamente
        </label>
      )}

      <label className="space-y-1 text-sm font-semibold">
        <span>{nameLabel}</span>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={nameLabel}
        />
      </label>

      {usesCode && (
        <label className="space-y-1 text-sm font-semibold">
          <span>Código</span>
          <Input
            disabled={
              kind === "category" &&
              !record &&
              details.automaticCode
            }
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={
              kind === "category" && details.automaticCode
                ? "Código será gerado automaticamente"
                : kind === "unit"
                  ? "UN"
                  : kind === "brand"
                    ? "MAR-001"
                    : "Código"
            }
          />
        </label>
      )}
    </>
  );
}
