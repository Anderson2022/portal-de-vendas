import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { DemoSectionHeader } from "../shared/demo-section-header";
import { DemoProductForm } from "./demo-product-form";
import { DemoProductsTable } from "./demo-products-table";
import type { DemoProduct } from "@/lib/demonstracao/types/demo-product";

export function DemoStock({
  products,
  onSave,
  error,
}: {
  products: DemoProduct[];
  error?: string;
  onSave: (product: DemoProduct) => boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DemoSectionHeader
        title="Estoque"
        action="Novo produto"
        onAdd={() => setOpen(true)}
      />
      <DemoProductsTable products={products} />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Novo produto · Demonstração"
      >
        {error && (
          <p role="alert" className="mb-4 text-sm text-coral-500">
            {error}
          </p>
        )}
        <DemoProductForm
          onCancel={() => setOpen(false)}
          onSave={(product) => {
            if (onSave(product)) setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
