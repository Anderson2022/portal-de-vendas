import { Button } from "@/components/ui/button";

export function DemoFormActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex justify-end gap-2 sm:col-span-2">
      <Button onClick={onCancel}>Cancelar</Button>
      <Button variant="primary" type="submit">
        Salvar na demonstração
      </Button>
    </div>
  );
}
