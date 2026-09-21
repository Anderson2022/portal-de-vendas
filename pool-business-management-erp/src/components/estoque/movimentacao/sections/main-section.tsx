import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { StockStructureOption } from "@/lib/estoque/stock-structure";
import { MovementSelect } from "../fields/movement-select";
import type { Option, StockMovementType } from "../movement-types";

type Props = {
  products: Option[];
  warehouses: Array<{ id: string | number; name: string }>;
  sites: StockStructureOption[];
  locations: StockStructureOption[];
  siteId: string;
  warehouseId: string;
  movementType: StockMovementType;
  onSiteChange: (v: string) => void;
  onWarehouseChange: (v: string) => void;
  onMovementTypeChange: (v: StockMovementType) => void;
};

export function MainSection({
  products,
  warehouses,
  sites,
  locations,
  siteId,
  warehouseId,
  movementType,
  onSiteChange,
  onWarehouseChange,
  onMovementTypeChange,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Unidade / estabelecimento">
          <Select
            required
            className="input"
            value={siteId}
            onChange={(e) => onSiteChange(e.target.value)}
          >
            <option value="">Selecione a unidade</option>
            {sites.map((x) => (
              <option key={x.id} value={x.id}>
                {x.code} - {x.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Depósito">
          <Select
            required
            name="warehouseId"
            className="input"
            value={warehouseId}
            onChange={(e) => onWarehouseChange(e.target.value)}
            disabled={!siteId}
          >
            <option value="">Selecione o depósito</option>
            {warehouses.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Localização">
          <Select
            required
            name="locationId"
            className="input"
            defaultValue=""
            disabled={!warehouseId}
          >
            <option value="">Selecione a localização</option>
            {locations.map((x) => (
              <option key={x.id} value={x.id}>
                {x.path || x.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Produto">
          <Select required name="productId" className="input" defaultValue="">
            <option value="">Selecione o produto</option>
            {products.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Tipo">
          <MovementSelect
            value={movementType}
            onChange={onMovementTypeChange}
          />
        </Field>
        <Field label="Quantidade">
          <Input
            required
            name="quantity"
            type="number"
            min="0.001"
            step="0.001"
            className="input"
            placeholder="0"
          />
        </Field>
        <Field label="Custo unitário">
          <Input
            name="unitCost"
            type="number"
            min="0"
            step="0.01"
            className="input"
            placeholder="R$ 0,00"
          />
        </Field>
      </div>
    </div>
  );
}
