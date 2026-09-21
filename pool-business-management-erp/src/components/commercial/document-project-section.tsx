import { Field } from "@/components/ui/field";
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import {
  type EditorItem,
  type FormOptions
} from "@/lib/commercial/domain";
import type { DocumentFormProps } from "./document-form-types";
import { ItemsEditor } from "./items-editor";

export function DocumentProjectSection({ quote, items, setItems, options }: { quote: DocumentFormProps["quote"]; items: EditorItem[]; setItems: (items: EditorItem[]) => void; options: FormOptions }) {

  return (
    <FormSection
      step={2}
      title="Projeto e itens"
      description="Adicione os produtos e serviços. Os valores são calculados automaticamente."
    >
      <div className="mb-5">
        <Field label="Nome do projeto *">
          <Input
            name="project"
            className="input"
            required
            maxLength={180}
            defaultValue={quote?.project}
            placeholder="Ex.: Piscina residencial + instalação"
          />
        </Field>
      </div>
      <ItemsEditor
        items={items}
        onChange={setItems}
        products={options.products}
      />
    </FormSection>
  );
}
