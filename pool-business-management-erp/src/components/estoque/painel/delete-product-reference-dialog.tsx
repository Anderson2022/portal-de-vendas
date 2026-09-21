"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function DeleteProductReferenceDialog({
  name,
  error,
  busy,
  onClose,
  onConfirm,
}: {
  name: string;
  error: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open title={error ? "Não foi possível excluir" : "Confirmar exclusão"} onClose={onClose}>
      <div className="space-y-5 pt-2">
        <p className="text-sm text-ink-600">
          {error || `Deseja realmente excluir “${name}”?`}
        </p>
        <div className="flex justify-end gap-3">
          {error ? (
            <Button variant="primary" onClick={onClose}>OK</Button>
          ) : (
            <>
              <Button onClick={onClose}>Cancelar</Button>
              <Button variant="danger" disabled={busy} onClick={onConfirm}>
                {busy ? "Excluindo..." : "Excluir"}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
