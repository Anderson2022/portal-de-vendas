"use client";

import { FormSection } from "@/components/ui/form-section";
import { CustomerFields } from "./customer-fields";
import { DocumentConditionsSection } from "./document-conditions-section";
import { DocumentFormActions } from "./document-form-actions";
import type { DocumentFormProps } from "./document-form-types";
import { DocumentProjectSection } from "./document-project-section";
import { DocumentSummary } from "./document-summary";
import { PaymentFields } from "./payment-fields";
import { useDocumentForm } from "./use-document-form";

export function DocumentForm({
  options,
  quote,
  kind = "quote",
}: DocumentFormProps) {
  const { items, setItems, discount, setDiscount, error, pending, summary, back, submit } = useDocumentForm({ quote, kind });
  return (
    <form
      className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
      onSubmit={submit}
    >
      <fieldset disabled={pending} className="min-w-0 space-y-6">
        <FormSection
          step={1}
          title="Cliente e responsável"
          description="Escolha para quem é a proposta e quem acompanha o atendimento."
        >
          <CustomerFields
            options={options}
            customerId={quote?.customerId}
            salespersonId={quote?.salespersonId}
          />
        </FormSection>
        <DocumentProjectSection quote={quote} items={items} setItems={setItems} options={options} />
        <DocumentConditionsSection quote={quote} kind={kind} discount={discount} setDiscount={setDiscount} />
        {kind === "sale" && (
          <FormSection
            step={4}
            title="Pagamento"
            description="Uma conta a receber será criada com estas condições."
          >
            <PaymentFields />
          </FormSection>
        )}
      </fieldset>
      <DocumentSummary {...summary} count={items.length}>
        <DocumentFormActions error={error} kind={kind} pending={pending} back={back} />
      </DocumentSummary>
    </form>
  );
}
