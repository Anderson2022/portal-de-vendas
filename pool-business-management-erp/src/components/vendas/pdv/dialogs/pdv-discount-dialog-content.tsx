import { usePdv } from "../pdv-context";
import { Percent } from "lucide-react";

export function PdvDiscountDialogContent() {
  const {
    setModal,
    message,
    subtotal,
    discountInput,
    setDiscountInput,
    setDiscount,
  } = usePdv();
  return (
    <>
      <h2>
        <Percent size={24} /> Aplicar desconto
      </h2>
      <p>Valor do desconto em reais (não pode ultrapassar o subtotal).</p>
      <label className="modal-field">
        Desconto (R$)
        <input
          autoFocus
          type="number"
          min="0"
          max={subtotal}
          value={discountInput}
          onChange={(e) => setDiscountInput(e.target.value)}
        />
      </label>
      <div className="modal-footer">
        <button onClick={() => setModal(null)}>Cancelar</button>
        <button
          className="primary-btn"
          onClick={() => {
            setDiscount(
              Math.min(subtotal, Math.max(0, Number(discountInput) || 0)),
            );
            setModal(null);
            message("Desconto aplicado.");
          }}
        >
          Aplicar desconto
        </button>
      </div>
    </>
  );
}
