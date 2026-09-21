import type { ProductType } from "../product-types";

import { ChemicalFields } from "./chemical-fields";
import { FilterFields } from "./filter-fields";
import { KitFields } from "./kit-fields";
import { MotorFields } from "./motor-fields";
import { PoolFields } from "./pool-fields";

export function SpecificFields({ type }: { type: ProductType }) {
  switch (type) {
    case "POOL":
      return <PoolFields />;
    case "MOTOR":
      return <MotorFields />;
    case "FILTER":
      return <FilterFields />;
    case "CHEMICAL":
      return <ChemicalFields />;
    case "KIT":
      return <KitFields />;
    default:
      return null;
  }
}
