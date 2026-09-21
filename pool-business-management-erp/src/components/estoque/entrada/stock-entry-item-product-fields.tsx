import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Option } from "./stock-entry-types";
import type { StockEntryItemState } from "./use-stock-entry-item";

export function StockEntryItemProductFields({ item, products }: { item: Pick<StockEntryItemState, "productId" | "setProductId" | "unit" | "setUnit" | "quantity" | "setQuantity">; products: Option[] }) {
  const { productId, setProductId, unit, setUnit, quantity, setQuantity } = item;
  return (<>
    <div className="col-span-4">
      <Field label="Produto / Serviço">
        <Select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="input"
        >
          <option value="">Selecione o produto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Select>
      </Field>
    </div>
    <div className="col-span-1">
      <Field label="Unidade">
        <Select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="input"
        >
          <option value="UN">UN</option>
          <option value="KG">KG</option>
          <option value="L">L</option>
          <option value="M">M</option>
          <option value="CX">CX</option>
          <option value="PCT">PCT</option>
        </Select>
      </Field>
    </div>
    <div className="col-span-1">
      <Field label="Qtde">
        <Input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
          min="0.001"
          step="0.001"
          className="input"
        />
      </Field>
    </div>
  </>);
}
