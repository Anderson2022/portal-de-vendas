import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { StockEntryItemState } from "./use-stock-entry-item";

export function StockEntryItemActions({ item }: { item: Pick<StockEntryItemState, "total" | "addItem"> }) {
  const { total, addItem } = item;
  return (<div className="col-span-12 flex items-center justify-between border-t pt-4">
    <div className="text-[13px] font-bold text-ink-500">
      Total do item:{" "}
      <span className="text-[15px] text-ink-900">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(total)}
      </span>
    </div>

    <Button
      variant="unstyled"
      type="button"
      className="btn btn-primary"
      onClick={addItem}
    >
      <Plus size={16} />
      Incluir
    </Button>
  </div>);
}
