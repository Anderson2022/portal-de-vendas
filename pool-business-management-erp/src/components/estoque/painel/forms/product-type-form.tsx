"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  ProductReferenceDetails,
  ProductReferenceDetailKey,
  SetProductReferenceDetail,
} from "../types/product-reference-form-types";

type ProductTypeFormProps = {
  details: ProductReferenceDetails;
  setDetail: SetProductReferenceDetail;
};

const BOOLEAN_FIELDS: Array<{
  key: ProductReferenceDetailKey;
  label: string;
}> = [
  { key: "physicalProduct", label: "Produto físico" },
  { key: "stockControlled", label: "Controla estoque" },
  { key: "purchaseAllowed", label: "Permite compra" },
  { key: "saleAllowed", label: "Permite venda" },
  { key: "batchControl", label: "Controla lote" },
  { key: "expirationControl", label: "Controla validade" },
  { key: "serialControl", label: "Controla número de série" },
];

export function ProductTypeForm({
  details,
  setDetail,
}: ProductTypeFormProps) {
  return (
    <>
      <label className="space-y-1 text-sm font-semibold sm:col-span-2">
        <span>Descrição</span>
        <Textarea
          rows={3}
          value={details.description}
          onChange={(event) =>
            setDetail("description", event.target.value)
          }
          placeholder="Descrição do comportamento operacional..."
        />
      </label>

      <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
        {BOOLEAN_FIELDS.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <input
              type="checkbox"
              checked={Boolean(details[key])}
              onChange={(event) =>
                setDetail(
                  key as
                    | "physicalProduct"
                    | "stockControlled"
                    | "purchaseAllowed"
                    | "saleAllowed"
                    | "batchControl"
                    | "expirationControl"
                    | "serialControl",
                  event.target.checked,
                )
              }
            />
            {label}
          </label>
        ))}
      </div>

      <label className="space-y-1 text-sm font-semibold sm:col-span-2">
        <span>Código do tipo fiscal/SPED</span>
        <Input
          value={details.fiscalItemTypeCode}
          onChange={(event) =>
            setDetail(
              "fiscalItemTypeCode",
              event.target.value.toUpperCase(),
            )
          }
          placeholder="Opcional"
        />
      </label>
    </>
  );
}
