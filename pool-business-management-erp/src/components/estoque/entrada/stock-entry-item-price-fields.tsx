import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { StockEntryItemState } from "./use-stock-entry-item";

export function StockEntryItemPriceFields({ item }: { item: Pick<StockEntryItemState, "unitCost" | "setUnitCost" | "salePrice" | "setSalePrice" | "discount" | "setDiscount"> }) {
  const { unitCost, setUnitCost, salePrice, setSalePrice, discount, setDiscount } = item;
  return (<>
    <div className="col-span-2">
      <Field label="Custo Unitário">
        <Input
          value={unitCost}
          onChange={(e) => setUnitCost(e.target.value)}
          type="number"
          min="0"
          step="0.01"
          className="input"
        />
      </Field>
    </div>
    <div className="col-span-2">
      <Field label="Preço de venda">
        <Input
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          type="number"
          min="0"
          step="0.01"
          className="input"
        />
      </Field>
    </div>
    <div className="col-span-2">
      <Field label="Desconto">
        <Input
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          type="number"
          min="0"
          step="0.01"
          className="input"
        />
      </Field>
    </div>
  </>);
}
