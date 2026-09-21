"use client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { brl } from "@/lib/format";
import type { EditorItem, FormOptions } from "@/lib/commercial/domain";
export function ItemsEditor({
  items,
  onChange,
  products,
}: {
  items: EditorItem[];
  onChange: (items: EditorItem[]) => void;
  products: FormOptions["products"];
}) {
  const update = (key: string, patch: Partial<EditorItem>) =>
    onChange(items.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  return (
    <div className="space-y-4">
      <Field
        label="Adicionar um produto do catálogo"
        hint="Ou use “Adicionar item” para descrever um serviço ou produto personalizado."
      >
        <Select
          className="input"
          value=""
          onChange={(e) => {
            const p = products.find((p) => p.id === e.target.value);
            if (p) {
              const item = {
                key: crypto.randomUUID(),
                productId: p.id,
                description: p.name,
                qty: "1",
                unitPrice: p.salePrice,
                unitCost: p.avgCost,
              };
              onChange(
                items.length === 1 && !items[0].description
                  ? [item]
                  : [...items, item],
              );
            }
          }}
        >
          <option value="">Selecione um produto...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {brl(Number(p.salePrice))}
            </option>
          ))}
        </Select>
      </Field>
      {items.map((item, index) => (
        <div key={item.key} className="inset-soft rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-ink-500">
              ITEM {index + 1}
            </span>
            <Button
              variant="danger"
              className="!p-2"
              disabled={items.length === 1}
              aria-label={`Remover item ${index + 1}`}
              onClick={() => onChange(items.filter((i) => i.key !== item.key))}
            >
              <Trash2 size={15} />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-4">
              <Field label="Descrição *">
                <Input
                  className="input"
                  required
                  maxLength={180}
                  value={item.description}
                  onChange={(e) =>
                    update(item.key, { description: e.target.value })
                  }
                  placeholder="Ex.: Piscina de fibra 6 × 3 m"
                />
              </Field>
            </div>
            <Field label="Quantidade *">
              <Input
                className="input"
                type="number"
                min="1"
                max="100000"
                step="1"
                required
                value={item.qty}
                onChange={(e) => update(item.key, { qty: e.target.value })}
              />
            </Field>
            <Field label="Preço unitário (R$) *">
              <Input
                className="input"
                type="number"
                min="0"
                step="0.01"
                required
                value={item.unitPrice}
                onChange={(e) =>
                  update(item.key, { unitPrice: e.target.value })
                }
              />
            </Field>
            <Field
              label="Custo unitário (R$)"
              hint={item.productId ? "Custo definido no cadastro do produto." : "Uso interno: cálculo do lucro."}
            >
              <Input
                className="input"
                type="number"
                min="0"
                step="0.01"
                required
                readOnly={Boolean(item.productId)}
                value={item.unitCost}
                onChange={(e) => update(item.key, { unitCost: e.target.value })}
              />
            </Field>
            <div className="flex flex-col justify-center">
              <span className="text-xs text-ink-500">Total do item</span>
              <strong className="mt-2 tabular-nums">
                {brl(Number(item.qty || 0) * Number(item.unitPrice || 0))}
              </strong>
            </div>
          </div>
        </div>
      ))}
      <Button
        onClick={() =>
          onChange([
            ...items,
            {
              key: crypto.randomUUID(),
              description: "",
              qty: "1",
              unitPrice: "0",
              unitCost: "0",
            },
          ])
        }
      >
        <Plus size={16} />
        Adicionar item
      </Button>
    </div>
  );
}
