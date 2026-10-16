import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { DemoSectionHeader } from "../shared/demo-section-header";
import { DemoSaleForm } from "./demo-sale-form";
import { DemoSalesTable } from "./demo-sales-table";
import type { DemoState } from "@/lib/demonstracao/types/demo-state";

export function DemoSales({
  state,
  onSave,
  error,
}: {
  state: DemoState;
  error?: string;
  onSave: (clientId: string, productId: string, quantity: number) => boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DemoSectionHeader
        title="Vendas"
        action="Simular venda"
        onAdd={() => setOpen(true)}
      />
      <DemoSalesTable state={state} />
      <Modal open={open} onClose={() => setOpen(false)} title="Simular venda">
        {error && (
          <p role="alert" className="mb-4 text-sm text-coral-500">
            {error}
          </p>
        )}
        <DemoSaleForm
          clients={state.clients}
          products={state.products}
          onCancel={() => setOpen(false)}
          onSave={(clientId, productId, quantity) => {
            if (onSave(clientId, productId, quantity)) setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
