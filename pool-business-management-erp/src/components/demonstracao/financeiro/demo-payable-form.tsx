import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { DemoFormActions } from "../shared/demo-form-actions";
import type { DemoPayable } from "@/lib/demonstracao/types/demo-payable";

export function DemoPayableForm({
  onSave,
  onCancel,
}: {
  onSave: (payable: DemoPayable) => void;
  onCancel: () => void;
}) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const description = String(data.get("description") || "").trim();
        if (!description) return;
        onSave({
          id: crypto.randomUUID(),
          description,
          amount: Number(data.get("amount")),
          dueDate: String(data.get("dueDate")),
          paid: false,
        });
      }}
    >
      <div className="sm:col-span-2">
        <Field label="Descrição">
          <Input name="description" required maxLength={255} />
        </Field>
      </div>
      <Field label="Valor (R$)">
        <Input name="amount" type="number" min="0.01" step="0.01" required />
      </Field>
      <Field label="Vencimento">
        <Input name="dueDate" type="date" required />
      </Field>
      <DemoFormActions onCancel={onCancel} />
    </form>
  );
}
