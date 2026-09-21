import { Button } from "@/components/ui/button";
import type { InventoryListItem } from "@/lib/estoque/inventory-process";

const closed = new Set(["CONCLUIDO", "CANCELADO"]);

export function InventoryList({ inventories, onCreate, onOpen }: {
  inventories: InventoryListItem[];
  onCreate: () => void;
  onOpen: (id: number) => void;
}) {
  return <div className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <div><h3 className="font-extrabold">Inventários</h3><p className="text-sm text-ink-400">Inventários em andamento podem bloquear movimentações dos produtos do escopo.</p></div>
      <Button variant="primary" onClick={onCreate}>Novo inventário</Button>
    </div>
    <div className="overflow-hidden rounded-2xl border border-ink-100">
      <div className="grid grid-cols-[150px_1fr_150px_170px_120px] gap-3 bg-white/50 px-4 py-3 text-xs font-extrabold"><span>NÚMERO</span><span>DEPÓSITO</span><span>TIPO</span><span>STATUS</span><span>AÇÃO</span></div>
      {inventories.map((inventory) => <div key={inventory.id} className="grid grid-cols-[150px_1fr_150px_170px_120px] items-center gap-3 border-t border-ink-100 px-4 py-3 text-sm"><strong>{inventory.numero}</strong><span>{inventory.deposito}</span><span>{inventory.tipo}</span><span className={closed.has(inventory.status) ? "text-ink-400" : "font-bold text-amber-600"}>{inventory.status.replaceAll("_", " ")}</span><Button variant="secondary" onClick={() => onOpen(inventory.id)}>Visualizar</Button></div>)}
      {!inventories.length && <p className="p-6 text-center text-sm text-ink-400">Nenhum inventário encontrado.</p>}
    </div>
  </div>;
}
