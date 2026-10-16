import Image from "next/image";
import { usePdv } from "../pdv-context";
import {
  Trash2,
  UserRound,
  Search,
  Plus,
  MapPin,
  Bike,
  Store,
  CreditCard,
  Check,
} from "lucide-react";
import { QtyControl } from "../shared/qty-control";
import { money } from "../utils/money";
import { IconButton } from "../shared/icon-button";
import { Empty } from "../shared/empty";
import { PdvDeliveryAddressForm } from "./pdv-delivery-address-form";
import { Totals } from "../shared/totals";
import { PaymentChoices } from "../shared/payment-choices";
export function PdvDeliveryCheckoutForm() {
  const {
    clearCart,
    lineItems,
    updateQty,
    client,
    setClient,
    setModal,
    deliverType,
    setDeliverType,
    subtotal,
    discount,
    deliveryFee,
    total,
    method,
    setMethod,
    startPayment,
  } = usePdv();
  return (
    <>
      <div className="panel-title">
        <h2>Finalização do pedido</h2>
        <button onClick={clearCart}>
          <Trash2 size={15} /> Limpar carrinho
        </button>
      </div>
      <div className="checkout-list">
        {lineItems.length ? (
          lineItems.map(({ item, product }) => (
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
                <small>{product.description || "Original"}</small>
              </span>
              <QtyControl
                qty={item.qty}
                onMinus={() => updateQty(item.id, -1)}
                onPlus={() => updateQty(item.id, 1)}
              />
              <strong>{money(item.qty * product.price)}</strong>
              <IconButton
                icon={Trash2}
                label="Remover"
                onClick={() => updateQty(item.id, -item.qty)}
              />
            </div>
          ))
        ) : (
          <Empty
            title="Carrinho vazio"
            desc="Escolha os produtos no catálogo."
          />
        )}
      </div>
      <h4>
        <UserRound size={15} /> Cliente
      </h4>
      <div className="inline-input">
        <Search size={15} />
        <input
          placeholder="Buscar cliente por nome ou telefone..."
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />
        <button onClick={() => setModal("customer")}>
          <Plus size={15} /> Novo cliente
        </button>
      </div>
      <h4>
        <MapPin size={15} /> Entrega / Retirada
      </h4>
      <div className="two-options">
        <button
          className={deliverType === "Entrega" ? "selected" : ""}
          onClick={() => setDeliverType("Entrega")}
        >
          <Bike size={17} /> Entrega
        </button>
        <button
          className={deliverType !== "Entrega" ? "selected" : ""}
          onClick={() => setDeliverType("Retirada no balcão")}
        >
          <Store size={17} /> Retirada no balcão
        </button>
      </div>
      {deliverType === "Entrega" && <PdvDeliveryAddressForm />}
      <Totals
        subtotal={subtotal}
        discount={discount}
        deliveryFee={deliveryFee}
        total={total}
        onDiscount={() => setModal("discount")}
      />
      <h4>
        <CreditCard size={15} /> Forma de pagamento
      </h4>
      <PaymentChoices method={method} setMethod={setMethod} compact />
      <div className="checkout-spacer" />
      <button className="primary-btn green-btn" onClick={startPayment}>
        <Check size={21} /> Finalizar pedido (Enter)
      </button>
    </>
  );
}
