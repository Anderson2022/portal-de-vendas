"use client";

import { Modal } from "@/components/ui/modal";
import type { LookupKind, LookupRecord } from "../produto/lookup/lookup-types";
import { ProductReferenceForm } from "./product-reference-form";
import { getProductReferenceFormLayout } from "./utils/product-reference-rules";

type ProductReferenceFormModalProps = {
  kind: LookupKind;
  label: string;
  record?: LookupRecord | null;
  onClose: () => void;
  onSaved: () => void;
};

export function ProductReferenceFormModal({
  kind,
  label,
  record,
  onClose,
  onSaved,
}: ProductReferenceFormModalProps) {
  const layout = getProductReferenceFormLayout(kind);

  return (
    <Modal
      open
      title={`${record ? "Editar" : "Cadastrar"} ${label}`}
      width={layout.width}
      height={layout.height}
      onClose={onClose}
    >
      <ProductReferenceForm
        kind={kind}
        record={record}
        onSaved={onSaved}
      />
    </Modal>
  );
}
