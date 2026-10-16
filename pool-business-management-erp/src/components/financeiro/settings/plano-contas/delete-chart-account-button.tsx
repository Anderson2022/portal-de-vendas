"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function DeleteChartAccountButton({
  name,
  hasLinks,
  pending,
  onDelete,
}: {
  name: string;
  hasLinks: boolean;
  pending: boolean;
  onDelete: () => Promise<void>;
}) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div>
      <Button
        variant="danger"
        disabled={hasLinks || pending}
        onClick={() => setConfirm(true)}
        aria-label="Excluir plano de contas"
        title={
          hasLinks
            ? "Existem registros ou subcontas vinculados."
            : "Excluir plano de contas"
        }
      >
        <Trash2 size={17} /> Excluir
      </Button>
      {hasLinks && (
        <p className="mt-2 text-sm text-ink-500">
          Exclusão indisponível: existem registros ou subcontas vinculados.
        </p>
      )}
      <Modal
        open={confirm}
        title="Excluir plano de contas"
        onClose={() => {
          if (!pending) setConfirm(false);
        }}
        width="max-w-lg"
      >
        <p className="py-4">Deseja excluir a conta “{name}”?</p>
        <div className="flex justify-end gap-2">
          <Button disabled={pending} onClick={() => setConfirm(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            disabled={pending}
            onClick={async () => {
              await onDelete();
              setConfirm(false);
            }}
          >
            {pending ? "Excluindo..." : "Confirmar exclusão"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
