import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { DemoFormActions } from "../shared/demo-form-actions";
import type { DemoProduct } from "@/lib/demonstracao/types/demo-product";

export function DemoProductForm({
  onSave,
  onCancel,
}: {
  onSave: (product: DemoProduct) => void;
  onCancel: () => void;
}) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = String(data.get("name") || "").trim();
        const sku = String(data.get("sku") || "").trim();
        if (!name || !sku) return;
        onSave({
          id: crypto.randomUUID(),
          name,
          sku,
          quantity: Number(data.get("quantity")),
          price: Number(data.get("price")),
        });
      }}
    >
      <div className="sm:col-span-2">
        <Field label="Produto">
          <Input name="name" required maxLength={180} />
        </Field>
      </div>
      <Field label="Código / SKU">
        <Input name="sku" required maxLength={60} />
      </Field>
      <Field label="Estoque inicial">
        <Input
          name="quantity"
          type="number"
          min="0"
          step="1"
          required
          defaultValue="0"
        />
      </Field>
      <Field label="Preço de venda (R$)">
        <Input name="price" type="number" min="0.01" step="0.01" required />
      </Field>
      <DemoFormActions onCancel={onCancel} />
    </form>
  );
}
