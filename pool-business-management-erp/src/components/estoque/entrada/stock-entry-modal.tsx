"use client";

import { Modal } from "@/components/ui/modal";

import { StockEntryForm } from "./stock-entry-form";
import type { StockEntryModalProps } from "./stock-entry-types";

export function StockEntryModal({
  products,
  suppliers,
  warehouses,
  costCenters = [],
  open,
  onClose,
  onSubmit,
}: StockEntryModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Entrada de Estoque"
      width="w-[95vw] max-w-[1500px]"
      height="h-[90vh]"
    >
      <StockEntryForm
        products={products}
        suppliers={suppliers}
        warehouses={warehouses}
        costCenters={costCenters}
        onCancel={onClose}
        onSuccess={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
