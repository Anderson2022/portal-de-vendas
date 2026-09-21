"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LookupRecord } from "../../produto/lookup/lookup-types";
import { ActiveField } from "../sections/active-field";
import type {
  ProductReferenceDetails,
  SetProductReferenceDetail,
} from "../types/product-reference-form-types";

type CategoryFormProps = {
  record?: LookupRecord | null;
  details: ProductReferenceDetails;
  categories: LookupRecord[];
  setDetail: SetProductReferenceDetail;
};

export function CategoryForm({
  record,
  details,
  categories,
  setDetail,
}: CategoryFormProps) {
  return (
    <>
      <select
        className="input"
        value={details.parentCategoryId}
        onChange={(event) =>
          setDetail("parentCategoryId", event.target.value)
        }
      >
        <option value="">Sem categoria pai</option>
        {categories
          .filter((item) => item.id !== record?.id)
          .map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
      </select>

      <Input
        value={details.description}
        onChange={(event) =>
          setDetail("description", event.target.value)
        }
        placeholder="Descrição"
      />

      <Input
        readOnly
        value={`Nível ${details.level || "1"}`}
        placeholder="Nível automático"
      />

      <Input
        type="number"
        min="0"
        value={details.displayOrder}
        onChange={(event) =>
          setDetail("displayOrder", event.target.value)
        }
        placeholder="Ordem de exibição"
      />

      <Input
        value={details.externalCode}
        onChange={(event) =>
          setDetail("externalCode", event.target.value)
        }
        placeholder="Código externo / integração"
      />

      <Textarea
        className="sm:col-span-2"
        rows={3}
        maxLength={320}
        value={details.seoDescription}
        onChange={(event) =>
          setDetail("seoDescription", event.target.value)
        }
        placeholder="Descrição para SEO"
      />

      <div className="space-y-2 sm:col-span-2">
        <label className="text-sm font-semibold">
          Imagem de capa
        </label>

        <Input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () =>
              setDetail("coverImage", String(reader.result));
            reader.readAsDataURL(file);
          }}
        />

        {details.coverImage && (
          <img
            src={details.coverImage}
            alt="Capa da categoria"
            className="h-32 w-full rounded-xl object-cover"
          />
        )}
      </div>

      <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={details.batchControlled}
            onChange={(event) =>
              setDetail("batchControlled", event.target.checked)
            }
          />
          Controla lote
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={details.expirationControlled}
            onChange={(event) =>
              setDetail(
                "expirationControlled",
                event.target.checked,
              )
            }
          />
          Controla validade
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={details.serialControlled}
            onChange={(event) =>
              setDetail("serialControlled", event.target.checked)
            }
          />
          Controla número de série
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={details.allowNegativeStock}
            onChange={(event) =>
              setDetail(
                "allowNegativeStock",
                event.target.checked,
              )
            }
          />
          Permite estoque negativo
        </label>
      </div>

      <Input
        type="number"
        min="0"
        step="0.001"
        value={details.defaultMinimumStock}
        onChange={(event) =>
          setDetail("defaultMinimumStock", event.target.value)
        }
        placeholder="Estoque mínimo padrão"
      />

      <Input
        type="number"
        min="0"
        step="0.001"
        value={details.defaultMaximumStock}
        onChange={(event) =>
          setDetail("defaultMaximumStock", event.target.value)
        }
        placeholder="Estoque máximo padrão"
      />

      <Input
        type="number"
        min="0"
        step="0.001"
        value={details.defaultSafetyStock}
        onChange={(event) =>
          setDetail("defaultSafetyStock", event.target.value)
        }
        placeholder="Estoque de segurança padrão"
      />

      <select
        className="input"
        value={details.defaultIssueMethod}
        onChange={(event) =>
          setDetail("defaultIssueMethod", event.target.value)
        }
      >
        <option value="">Método de saída padrão</option>
        <option value="FIFO">FIFO</option>
        <option value="FEFO">FEFO</option>
      </select>

      <Input
        type="number"
        min="0"
        value={details.inactiveDays}
        onChange={(event) =>
          setDetail("inactiveDays", event.target.value)
        }
        placeholder="Dias sem movimento"
      />

      <Textarea
        className="sm:col-span-2"
        rows={3}
        value={details.notes}
        onChange={(event) =>
          setDetail("notes", event.target.value)
        }
        placeholder="Observações"
      />

      <ActiveField
        checked={details.active}
        onChange={(value) => setDetail("active", value)}
        label="Categoria ativa"
      />
    </>
  );
}
