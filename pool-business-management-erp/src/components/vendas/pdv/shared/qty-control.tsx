import { Minus, Plus } from "lucide-react";
export function QtyControl({
  qty,
  onMinus,
  onPlus,
}: {
  qty: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="qty-control">
      <button onClick={onMinus}>
        <Minus size={13} />
      </button>
      <b>{qty}</b>
      <button onClick={onPlus}>
        <Plus size={13} />
      </button>
    </div>
  );
}
