import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { DemoFormActions } from "../shared/demo-form-actions";
import { brl } from "@/lib/format";
import type { DemoProduct } from "@/lib/demonstracao/types/demo-product";
import type { DemoClient } from "@/lib/demonstracao/types/demo-client";

export function DemoSaleForm({
  clients,
  products,
  onSave,
  onCancel,
}: {
  clients: DemoClient[];
  products: DemoProduct[];
  onSave: (clientId: string, productId: string, quantity: number) => void;
  onCancel: () => void;
}) {
  const available = products.filter((product) => product.quantity > 0);
  const [productId, setProductId] = useState(available[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const product = available.find((item) => item.id === productId);
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        onSave(String(data.get("clientId")), productId, quantity);
      }}
    >
      <Field label="Cliente">
        <select className="input" name="clientId" required defaultValue="">
          <option value="" disabled>
            Selecione um cliente
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Produto">
        <select
          className="input"
          value={productId}
          required
          onChange={(event) => {
            setProductId(event.target.value);
            setQuantity(1);
          }}
        >
          {available.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} · {item.quantity} disponíveis
            </option>
          ))}
        </select>
      </Field>
      <Field label="Quantidade">
        <Input
          name="quantity"
          type="number"
          min="1"
          max={product?.quantity || 1}
          step="1"
          required
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
      </Field>
      <p className="font-bold text-water-700">
        Total: {brl((product?.price || 0) * quantity)}
      </p>
      {(!clients.length || !available.length) && (
        <p role="status" className="text-sm text-coral-500">
          Cadastre um cliente e um produto com estoque para simular a venda.
        </p>
      )}
      <DemoFormActions onCancel={onCancel} />
    </form>
  );
}
