import { Waves } from "lucide-react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { NumberField } from "../fields/number-field";
import { ProductSection } from "../product-section";

export function PoolFields() {
  return (
    <ProductSection
      icon={<Waves size={17} />}
      title="Características da piscina"
      description="Dimensões e informações técnicas."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Modelo">
          <Input name="poolModel" className="input" />
        </Field>
        <NumberField label="Comprimento (m)" name="length" />
        <NumberField label="Largura (m)" name="width" />
        <NumberField label="Profundidade (m)" name="depth" />
        <NumberField label="Volume (L)" name="volume" />
        <Field label="Cor">
          <Input name="color" className="input" />
        </Field>
        <NumberField label="Garantia (meses)" name="warrantyMonths" step={1} />
      </div>
    </ProductSection>
  );
}
