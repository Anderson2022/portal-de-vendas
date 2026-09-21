"use client";

import { StockEntryItemActions } from "./stock-entry-item-actions";
import { StockEntryItemPriceFields } from "./stock-entry-item-price-fields";
import { StockEntryItemProductFields } from "./stock-entry-item-product-fields";
import { StockEntryItemTrackingFields } from "./stock-entry-item-tracking-fields";
import { useStockEntryItem } from "./use-stock-entry-item";
import type { Option, StockEntryItem } from "./stock-entry-types";

type Props = {
  products: Option[];
  onAdd: (item: StockEntryItem) => void;
};

export function StockEntryItemForm({ products, onAdd }: Props) {
  const item = useStockEntryItem({ products, onAdd });
  return (
    <section className="rounded-[22px] border border-white/70 bg-white/70 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-[14px] font-extrabold text-ink-900">
          Incluir produto
        </h3>
        <p className="text-[12px] text-ink-300">
          Adicione os produtos recebidos nesta entrada.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <StockEntryItemProductFields item={item} products={products} />

        <StockEntryItemPriceFields item={item} />

        <StockEntryItemTrackingFields item={item} />

        <StockEntryItemActions item={item} />
      </div>
    </section>
  );
}
