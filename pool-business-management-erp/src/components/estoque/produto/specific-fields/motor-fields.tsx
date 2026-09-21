import { Gauge } from "lucide-react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import { NumberField } from "../fields/number-field";
import { ProductSection } from "../product-section";

export function MotorFields() {
  return (
    <ProductSection
      icon={<Gauge size={17} />}
      title="Características do motor / bomba"
      description="Potência, tensão e garantia."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Potência">
          <Input name="power" className="input" placeholder="1/3 CV" />
        </Field>

        <Field label="Voltagem">
          <Select name="voltage" className="input" defaultValue="220">
            <option value="127">127 V</option>
            <option value="220">220 V</option>
            <option value="BIVOLT">Bivolt</option>
          </Select>
        </Field>

        <NumberField label="Garantia (meses)" name="warrantyMonths" step={1} />
      </div>
    </ProductSection>
  );
}
