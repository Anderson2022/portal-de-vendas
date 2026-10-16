import { money } from "../utils/money";
import { Plus } from "lucide-react";
export function Totals({
  subtotal,
  discount,
  total,
  deliveryFee = 0,
  onDiscount,
}: {
  subtotal: number;
  discount: number;
  total: number;
  deliveryFee?: number;
  onDiscount: () => void;
}) {
  return (
    <div className="totals">
      <p>
        Subtotal <b>{money(subtotal)}</b>
      </p>
      {deliveryFee > 0 && (
        <p>
          Taxa de entrega <b>{money(deliveryFee)}</b>
        </p>
      )}
      <p>
        Desconto <button onClick={onDiscount}>{money(discount)}</button>
      </p>
      <button className="apply-coupon" onClick={onDiscount}>
        <Plus size={13} /> Adicionar desconto / cupom
      </button>
      <div className="totals-total">
        Total <strong>{money(total)}</strong>
      </div>
    </div>
  );
}
