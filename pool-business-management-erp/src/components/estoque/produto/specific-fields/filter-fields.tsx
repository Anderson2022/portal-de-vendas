import { Filter } from "lucide-react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { NumberField } from "../fields/number-field";
import { ProductSection } from "../product-section";

export function FilterFields() {
  return (
    <ProductSection
      icon={<Filter size={17} />}
      title="Características do filtro"
      description="Modelo, vazão e garantia."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Modelo">
          <Input name="filterModel" className="input" />
        </Field>

        <Field label="Vazão">
          <Input name="flowRate" className="input" placeholder="6 m³/h" />
        </Field>

        <NumberField label="Garantia (meses)" name="warrantyMonths" step={1} />
      </div>
    </ProductSection>
  );
}
