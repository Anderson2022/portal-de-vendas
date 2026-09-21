import { FlaskConical } from "lucide-react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { ProductSection } from "../product-section";

export function ChemicalFields() {
  return (
    <ProductSection
      icon={<FlaskConical size={17} />}
      title="Características do produto químico"
      description="Informações específicas de produtos químicos."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Peso / volume">
          <Input name="packageSize" className="input" placeholder="1 kg" />
        </Field>

        <Field label="Concentração">
          <Input name="concentration" className="input" placeholder="65%" />
        </Field>

        <Field label="Princípio ativo">
          <Input name="activeIngredient" className="input" />
        </Field>

        <Field label="Modo de aplicação">
          <Input name="applicationMode" className="input" />
        </Field>
      </div>
    </ProductSection>
  );
}
