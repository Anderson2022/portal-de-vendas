"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LookupRecord } from "../../produto/lookup/lookup-types";
import type {
  ProductReferenceDetails,
  SetProductReferenceDetail,
} from "../types/product-reference-form-types";

type UnitFormProps = {
  record?: LookupRecord | null;
  details: ProductReferenceDetails;
  units: LookupRecord[];
  setDetail: SetProductReferenceDetail;
};

export function UnitForm({
  record,
  details,
  units,
  setDetail,
}: UnitFormProps) {
  return (
    <>
      <label className="space-y-1 text-sm font-semibold">
        <span>Sigla</span>
        <Input
          value={details.unitSymbol}
          maxLength={10}
          onChange={(event) =>
            setDetail(
              "unitSymbol",
              event.target.value.toUpperCase(),
            )
          }
          placeholder="UN"
        />
      </label>

      <label className="space-y-1 text-sm font-semibold">
        <span>Tipo</span>
        <select
          className="input w-full"
          value={details.unitType}
          onChange={(event) =>
            setDetail("unitType", event.target.value)
          }
        >
          <option value="UNIDADE">Unidade</option>
          <option value="PESO">Peso</option>
          <option value="VOLUME">Volume</option>
          <option value="COMPRIMENTO">Comprimento</option>
          <option value="AREA">Área</option>
          <option value="EMBALAGEM">Embalagem</option>
          <option value="OUTRO">Outro</option>
        </select>
      </label>

      <label className="space-y-1 text-sm font-semibold">
        <span>Casas decimais</span>
        <Input
          type="number"
          min="0"
          max="6"
          value={details.decimalPlaces}
          onChange={(event) =>
            setDetail("decimalPlaces", event.target.value)
          }
          placeholder="0"
        />
      </label>

      <label className="space-y-1 text-sm font-semibold">
        <span>Unidade base/referência</span>
        <select
          className="input w-full"
          value={details.baseUnitId}
          onChange={(event) => {
            setDetail("baseUnitId", event.target.value);

            if (!event.target.value) {
              setDetail("conversionFactor", "1.000000");
            }
          }}
        >
          <option value="">Ela mesma</option>
          {units
            .filter((item) => item.id !== record?.id)
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.value}
              </option>
            ))}
        </select>
      </label>

      <label className="space-y-1 text-sm font-semibold">
        <span>Fator de conversão</span>
        <Input
          type="number"
          min="0.000001"
          step="0.000001"
          disabled={!details.baseUnitId}
          value={details.conversionFactor}
          onChange={(event) =>
            setDetail("conversionFactor", event.target.value)
          }
          placeholder="1.000000"
        />
      </label>

      <label className="space-y-1 text-sm font-semibold sm:col-span-2">
        <span>Descrição</span>
        <Textarea
          rows={3}
          value={details.description}
          onChange={(event) =>
            setDetail("description", event.target.value)
          }
          placeholder="Descrição completa..."
        />
      </label>
    </>
  );
}
