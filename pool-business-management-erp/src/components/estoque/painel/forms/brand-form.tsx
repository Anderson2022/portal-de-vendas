"use client";

import { Input } from "@/components/ui/input";
import type { LookupRecord } from "../../produto/lookup/lookup-types";
import type {
  ProductReferenceDetails,
  SetProductReferenceDetail,
} from "../types/product-reference-form-types";

type BrandFormProps = {
  details: ProductReferenceDetails;
  manufacturers: LookupRecord[];
  setDetail: SetProductReferenceDetail;
};

export function BrandForm({
  details,
  manufacturers,
  setDetail,
}: BrandFormProps) {
  return (
    <>
      <Input
        value={details.shortName}
        onChange={(event) =>
          setDetail("shortName", event.target.value)
        }
        placeholder="Nome reduzido"
      />

      <select
        className="input"
        value={details.manufacturerId}
        onChange={(event) =>
          setDetail("manufacturerId", event.target.value)
        }
      >
        <option value="">Sem fabricante vinculado</option>
        {manufacturers.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <Input
        value={details.externalCode}
        onChange={(event) =>
          setDetail("externalCode", event.target.value)
        }
        placeholder="Código externo / integração"
      />

      <div className="space-y-1">
        <label className="text-sm font-semibold">
          Logo / imagem
        </label>
        <Input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () =>
              setDetail("logoUrl", String(reader.result));
            reader.readAsDataURL(file);
          }}
        />
      </div>
    </>
  );
}
