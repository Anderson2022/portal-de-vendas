import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { PayableTab } from "./payable-form-types";
import { usePayableForm } from "./use-payable-form";
import { PayableTabs } from "./payable-tabs";
import { PayableTitleSection } from "./payable-title-section";
import { PayableValuesSection } from "./payable-values-section";
import { PayableClassificationSection } from "./payable-classification-section";
import { PayablePaymentSection } from "./payable-payment-section";
import { PayableDocumentsSection } from "./payable-documents-section";
import { PayableSummary } from "./payable-summary";

const order: PayableTab[] = [
  "title",
  "values",
  "classification",
  "payment",
  "documents",
];

export function PayableForm({
  suppliers,
  pending,
  error,
  onCancel,
  onSubmit,
}: {
  suppliers: Array<{ id: string; name: string }>;
  pending: boolean;
  error: string;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const form = usePayableForm();
  const index = order.indexOf(form.tab);
  const invalidAllocation =
    form.state.allocations.length > 0 && form.allocationTotal !== 100;

  return (
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <PayableTabs active={form.tab} onChange={form.setTab} />
      <fieldset
        disabled={pending}
        className="min-h-0 flex-1 overflow-y-auto bg-slate-50/60 p-4 md:p-6"
      >
        <div className="mx-auto grid max-w-[1500px] gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div hidden={form.tab !== "title"}>
              <PayableTitleSection suppliers={suppliers} />
            </div>
            <div hidden={form.tab !== "values"}>
              <PayableValuesSection
                state={form.state}
                netAmount={form.netAmount}
                installments={form.installments}
                update={form.update}
              />
            </div>
            <div hidden={form.tab !== "classification"}>
              <PayableClassificationSection
                state={form.state}
                amount={form.netAmount}
                allocationTotal={form.allocationTotal}
                update={form.update}
                updateAllocation={form.updateAllocation}
              />
            </div>
            <div hidden={form.tab !== "payment"}>
              <PayablePaymentSection />
            </div>
            <div hidden={form.tab !== "documents"}>
              <PayableDocumentsSection />
            </div>
          </div>
          <PayableSummary
            amount={form.state.amount}
            interest={form.state.interest}
            fine={form.state.fine}
            discount={form.state.discount}
            netAmount={form.netAmount}
          />
        </div>
      </fieldset>
      {error && (
        <p
          role="alert"
          className="shrink-0 bg-red-50 px-6 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
        <Button disabled={pending} onClick={onCancel}>
          Cancelar
        </Button>
        <div className="flex gap-2">
          {index > 0 && (
            <Button
              type="button"
              disabled={pending}
              onClick={() => form.setTab(order[index - 1])}
            >
              Voltar
            </Button>
          )}
          {index < order.length - 1 ? (
            <Button
              type="button"
              variant="primary"
              disabled={pending}
              onClick={() => form.setTab(order[index + 1])}
            >
              Próximo
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              disabled={pending || invalidAllocation}
            >
              {pending ? "Salvando…" : "Salvar conta"}
            </Button>
          )}
        </div>
      </footer>
    </form>
  );
}
