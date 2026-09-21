import { Download, PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  pending: boolean;
  onCancel: () => void;
  onExport: () => void;
  done: boolean;
  editing?: boolean;
};

export function ProductFormActions({
  pending,
  onCancel,
  onExport,
  done,
  editing = false,
}: Props) {
  return (
    <div className="sticky bottom-0 z-10 flex flex-wrap justify-end gap-3 border-t bg-[#dedee1] py-4">
      <Button onClick={onExport} disabled={pending} className="mr-auto"><Download size={16} />Exportar ficha</Button>
      <Button
        variant="unstyled"
        type="button"
        onClick={onCancel}
        disabled={pending}
        className="btn btn-neu"
      >
        {done ? "Concluir" : "Cancelar"}
      </Button>

      {!done && <Button
        variant="unstyled"
        disabled={pending}
        type="submit"
        className="btn btn-primary"
      >
        <PackagePlus size={16} />
        {pending ? (editing ? "Salvando..." : "Cadastrando...") : (editing ? "Salvar alterações" : "Cadastrar produto")}
      </Button>}
    </div>
  );
}
