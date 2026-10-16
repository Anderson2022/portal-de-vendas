import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { DemoFormActions } from "../shared/demo-form-actions";
import type { DemoClient } from "@/lib/demonstracao/types/demo-client";

export function DemoClientForm({
  onSave,
  onCancel,
}: {
  onSave: (client: DemoClient) => void;
  onCancel: () => void;
}) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = String(data.get("name") || "").trim();
        if (!name) return;
        onSave({
          id: crypto.randomUUID(),
          name,
          email: String(data.get("email") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
        });
      }}
    >
      <div className="sm:col-span-2">
        <Field label="Nome">
          <Input name="name" required maxLength={160} />
        </Field>
      </div>
      <Field label="E-mail">
        <Input name="email" type="email" maxLength={180} />
      </Field>
      <Field label="Telefone">
        <Input name="phone" maxLength={30} />
      </Field>
      <DemoFormActions onCancel={onCancel} />
    </form>
  );
}
