import type { PayMethod } from "../types/pay-method";
import { Banknote, CreditCard, Sparkles, Gift } from "lucide-react";
import type { LucideIcon } from "lucide-react";
export function PaymentChoices({
  method,
  setMethod,
  big,
  compact,
}: {
  method: PayMethod;
  setMethod: (p: PayMethod) => void;
  big?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`payment-choices ${big ? "payment-big" : ""} ${compact ? "payment-compact" : ""}`}
    >
      {(
        [
          { name: "Dinheiro", icon: Banknote },
          { name: "Cartão", icon: CreditCard },
          { name: "PIX", icon: Sparkles },
          { name: "Voucher", icon: Gift },
        ] as { name: PayMethod; icon: LucideIcon }[]
      ).map(({ name, icon: Icon }) => (
        <button
          key={name}
          className={method === name ? "selected" : ""}
          onClick={() => setMethod(name)}
        >
          <span>
            <Icon size={big ? 27 : 18} />
          </span>
          {name}
          {big && <i className="choice-radio" />}
        </button>
      ))}
    </div>
  );
}
