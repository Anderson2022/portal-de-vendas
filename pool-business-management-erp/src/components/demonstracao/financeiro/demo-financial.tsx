import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { DemoSectionHeader } from "../shared/demo-section-header";
import { DemoPayableForm } from "./demo-payable-form";
import { DemoPayablesTable } from "./demo-payables-table";
import type { DemoPayable } from "@/lib/demonstracao/types/demo-payable";

export function DemoFinancial({
  payables,
  onSave,
  error,
  onPay,
}: {
  payables: DemoPayable[];
  error?: string;
  onSave: (payable: DemoPayable) => boolean;
  onPay: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DemoSectionHeader
        title="Contas a pagar"
        action="Nova conta"
        onAdd={() => setOpen(true)}
      />
      <DemoPayablesTable payables={payables} onPay={onPay} />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nova conta · Demonstração"
      >
        {error && (
          <p role="alert" className="mb-4 text-sm text-coral-500">
            {error}
          </p>
        )}
        <DemoPayableForm
          onCancel={() => setOpen(false)}
          onSave={(payable) => {
            if (onSave(payable)) setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
