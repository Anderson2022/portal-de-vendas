import { Field } from "@/components/ui/field";
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  todayISO
} from "@/lib/commercial/domain";
import type { DocumentFormProps } from "./document-form-types";

export function DocumentConditionsSection({ quote, kind, discount, setDiscount }: { quote: DocumentFormProps["quote"]; kind: DocumentFormProps["kind"]; discount: string; setDiscount: (value: string) => void }) {

  return (
    <FormSection
      step={3}
      title="Condições da proposta"
      description="Defina o desconto, a validade e as informações que o cliente precisa conhecer."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Desconto (R$)">
          <Input
            type="number"
            min="0"
            step="0.01"
            className="input"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </Field>
        {kind === "quote" && (
          <Field label="Válido até *">
            <Input
              name="validUntil"
              type="date"
              required
              className="input"
              defaultValue={quote?.validUntil || todayISO()}
            />
          </Field>
        )}
        <div className="sm:col-span-2">
          <Field label="Observações e condições">
            <Textarea
              name="notes"
              rows={4}
              maxLength={5000}
              className="input"
              defaultValue={quote?.notes}
              placeholder="Prazo de entrega, instalação, garantia e condições combinadas..."
            />
          </Field>
        </div>
      </div>
    </FormSection>
  );
}
