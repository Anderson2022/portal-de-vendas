import Image from "next/image";
import { usePdv } from "../pdv-context";
import {
  ShoppingCart,
  Trash2,
  Clock3,
  UserRound,
  Pencil,
  Users,
  CreditCard,
  X,
  Receipt,
} from "lucide-react";
import { QtyControl } from "../shared/qty-control";
import { money } from "../utils/money";
import { IconButton } from "../shared/icon-button";
import { Empty } from "../shared/empty";
import { staff } from "../constants/staff";
import { Totals } from "../shared/totals";
import { PaymentChoices } from "../shared/payment-choices";
export function PdvServiceCheckout() {
  const {
    clearCart,
    lineItems,
    selectedStaff,
    updateQty,
    setModal,
    message,
    setSelectedStaff,
    subtotal,
    discount,
    total,
    method,
    setMethod,
    received,
    setReceived,
    receivedValue,
    printing,
    setPrinting,
    whatsapp,
    setWhatsapp,
    startPayment,
  } = usePdv();
  return (
    <aside className="work-panel checkout service-checkout">
      <div className="panel-title">
        <h2>
          <ShoppingCart size={22} /> Finalização da venda
        </h2>
        <button onClick={clearCart}>
          <Trash2 size={15} /> Limpar
        </button>
      </div>
      <h4>Serviços selecionados ({lineItems.length})</h4>
      <div className="checkout-list">
        {lineItems.map(({ item, product }) => (
          <div className="checkout-item" key={item.id}>
            <Image
              unoptimized
              src={product.image}
              alt={product.name}
              width={160}
              height={160}
            />
            <span>
              <b>{product.name}</b>
              <small>
                Profissional:{" "}
                {selectedStaff === "Todos" ? "Carlos" : selectedStaff}
              </small>
              <small>
                <Clock3 size={12} /> {product.duration} min
              </small>
            </span>
            <QtyControl
              qty={item.qty}
              onMinus={() => updateQty(item.id, -1)}
              onPlus={() => updateQty(item.id, 1)}
            />
            <strong>{money(product.price * item.qty)}</strong>
            <IconButton
              icon={Trash2}
              onClick={() => updateQty(item.id, -item.qty)}
              label="Remover"
            />
          </div>
        ))}
        {!lineItems.length && <Empty title="Selecione um serviço" />}
      </div>
      <div className="checkout-actions">
        <button onClick={() => setModal("customer")}>
          <UserRound size={16} /> Cliente (F4)
        </button>
        <button
          onClick={() => message("Observação incluída na venda demonstrativa.")}
        >
          <Pencil size={16} /> Observação
        </button>
        <button onClick={() => setSelectedStaff(staff[0].name)}>
          <Users size={16} /> Profissional
        </button>
      </div>
      <Totals
        subtotal={subtotal}
        discount={discount}
        total={total}
        onDiscount={() => setModal("discount")}
      />
      <h4>Forma de pagamento</h4>
      <PaymentChoices method={method} setMethod={setMethod} />
      <h4>Valor recebido</h4>
      <input
        className="money-input"
        value={received}
        onChange={(e) => setReceived(e.target.value)}
      />
      <div className="quick-money">
        {[10, 20, 50, 100, 200].map((v) => (
          <button
            key={v}
            onClick={() => setReceived(v.toFixed(2).replace(".", ","))}
          >
            R$ {v}
          </button>
        ))}
      </div>
      <div className="change-preview">
        Troco <b>{money(Math.max(0, receivedValue - total))}</b>
      </div>
      <label className="toggle-row">
        Imprimir comprovante{" "}
        <input
          type="checkbox"
          checked={printing}
          onChange={(e) => setPrinting(e.target.checked)}
        />
      </label>
      <label className="toggle-row">
        Enviar por WhatsApp{" "}
        <input
          type="checkbox"
          checked={whatsapp}
          onChange={(e) => setWhatsapp(e.target.checked)}
        />
      </label>
      <div className="checkout-spacer" />
      <button className="primary-btn" onClick={startPayment}>
        <CreditCard size={20} /> Finalizar venda (Enter)
      </button>
      <div className="checkout-actions bottom-actions">
        <button onClick={clearCart}>
          <X size={16} /> Cancelar
        </button>
        <button onClick={() => message("Pré-venda emitida (simulação).")}>
          <Receipt size={16} /> Emitir pré-venda
        </button>
      </div>
    </aside>
  );
}
