"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Option } from "../produto/product-types";
import { InventoryProductPickerModal } from "./inventory-product-picker-modal";

export function InventoryScopeFields({
  type,
  products,
  selected,
  onSelected,
  categories,
  categoryId,
  onCategory,
  locations,
  locationId,
  onLocation,
  lot,
  onLot,
}: {
  type: string;
  products: Option[];
  selected: string[];
  onSelected: (ids: string[]) => void;
  categories: Option[];
  categoryId: string;
  onCategory: (id: string) => void;
  locations: Option[];
  locationId: string;
  onLocation: (id: string) => void;
  lot: string;
  onLot: (value: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  if (type === "GERAL")
    return (
      <p className="rounded-2xl border p-4 text-sm">
        Todos os produtos com estoque ou vínculo no depósito serão incluídos
        automaticamente.
      </p>
    );
  if (type === "CATEGORIA")
    return (
      <label className="space-y-1 text-sm font-semibold">
        <span>Categoria do escopo</span>
        <select
          className="input w-full"
          value={categoryId}
          onChange={(event) => onCategory(event.target.value)}
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
    );
  if (type === "LOCALIZACAO")
    return (
      <label className="space-y-1 text-sm font-semibold">
        <span>Localização do escopo</span>
        <select
          className="input w-full"
          value={locationId}
          onChange={(event) => onLocation(event.target.value)}
        >
          <option value="">Selecione uma localização</option>
          {locations.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        {!locations.length && (
          <small className="block font-normal text-ink-400">
            Selecione um depósito que possua localizações cadastradas.
          </small>
        )}
      </label>
    );
  const selectedProducts = products.filter((product) =>
    selected.includes(product.id),
  );
  return (
    <div className="rounded-2xl border p-4">
      <strong>Produtos do escopo</strong>
      <button
        type="button"
        className="input mt-3 flex w-full items-center justify-between text-left"
        onClick={() => setPickerOpen(true)}
      >
        <span className={selected.length ? "" : "text-ink-400"}>
          {selected.length
            ? `${selected.length} produto(s) selecionado(s)`
            : "Pesquisar e selecionar produtos..."}
        </span>
        <Search size={18} />
      </button>
      {!!selectedProducts.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <span
              key={product.id}
              className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 text-sm"
            >
              {product.name}
              <button
                type="button"
                aria-label={`Remover ${product.name}`}
                onClick={() =>
                  onSelected(selected.filter((id) => id !== product.id))
                }
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
      {type === "LOTE" && (
        <label className="mt-4 block space-y-1 text-sm font-semibold">
          <span>Lote</span>
          <Input
            value={lot}
            onChange={(event) => onLot(event.target.value)}
            placeholder="Informe o lote"
          />
        </label>
      )}
      {pickerOpen && (
        <InventoryProductPickerModal
          products={products}
          selected={selected}
          onConfirm={onSelected}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
