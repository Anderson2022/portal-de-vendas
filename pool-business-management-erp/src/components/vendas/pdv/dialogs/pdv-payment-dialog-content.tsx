import { usePdv } from "../pdv-context";
import { CreditCard } from "lucide-react";
import { money } from "../utils/money";
import { PaymentChoices } from "../shared/payment-choices";
import { ShareIcon } from "../shared/share-icon";

export function PdvPaymentDialogContent() {
  const {
    setModal,
    total,
    method,
    setMethod,
    received,
    setReceived,
    receivedValue,
    setSplit,
    split,
    message,
    confirmPayment,
  } = usePdv();
  return (
    <>
      <h2>Pagamento da venda</h2>
      <div className="payment-amount">
        <span>Total da venda</span>
        <strong>{money(total)}</strong>
      </div>
      <h3>Forma de pagamento</h3>
      <PaymentChoices method={method} setMethod={setMethod} big />
      <label className="payment-label">
        {method === "Dinheiro" ? "Valor recebido" : "Valor a pagar"}
        <div className="received-input">
          <span>R$</span>
          <input
            value={received}
            onChange={(e) => setReceived(e.target.value)}
          />
        </div>
      </label>
      {method === "Dinheiro" && (
        <div className="change-panel">
          <span>Troco</span>
          <strong>{money(Math.max(0, receivedValue - total))}</strong>
        </div>
      )}
      <button
        className="split-btn"
        onClick={() => {
          setSplit(!split);
          message(
            split
              ? "Pagamento simples selecionado."
              : "Pagamento dividido: escolha a forma principal e confirme.",
          );
        }}
      >
        <ShareIcon />{" "}
        {split ? "Pagamento dividido ativado" : "Dividir pagamento"}
      </button>
      <div className="modal-footer">
        <button onClick={() => setModal(null)}>Cancelar (ESC)</button>
        <button className="primary-btn green-btn" onClick={confirmPayment}>
          <CreditCard size={19} /> Confirmar pagamento (F9)
        </button>
      </div>
    </>
  );
}
