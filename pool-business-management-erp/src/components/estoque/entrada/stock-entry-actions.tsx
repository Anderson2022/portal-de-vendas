import { FileUp, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  pending: boolean;
  canSave: boolean;
  onCancel: () => void;
};

export function StockEntryActions({
  pending,
  canSave,
  onCancel,
}: Props) {
  return (
    <div className="flex items-center justify-between border-t pt-4">
      <div className="flex items-center gap-2">
        <Button
          variant="unstyled"
          type="button"
          className="btn btn-neu"
        >
          <FileUp size={16} />
          Importar XML
        </Button>

        <Button
          variant="unstyled"
          type="button"
          className="btn btn-neu"
        >
          Resumo fiscal
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="unstyled"
          type="button"
          disabled={pending}
          onClick={onCancel}
          className="btn btn-neu"
        >
          <X size={16} />
          Cancelar
        </Button>

        <Button
          variant="unstyled"
          type="submit"
          disabled={pending || !canSave}
          className="btn btn-primary"
        >
          <Save size={16} />
          {pending ? "Salvando..." : "Salvar entrada"}
        </Button>
      </div>
    </div>
  );
}
