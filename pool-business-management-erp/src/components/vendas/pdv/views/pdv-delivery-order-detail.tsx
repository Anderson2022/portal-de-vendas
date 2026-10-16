import Image from "next/image";
import { usePdv } from "../pdv-context";
import {
  UserRound,
  Phone,
  MapPin,
  CreditCard,
  Check,
  Bike,
} from "lucide-react";
import { foodProducts } from "../constants/food-products";
import { money } from "../utils/money";
export function PdvDeliveryOrderDetail() {
  const { setDeliveryTab, selected, address, total, changeOrder } = usePdv();
  return (
    <>
      <div className="panel-title">
        <h2>Detalhes do pedido</h2>
        <button onClick={() => setDeliveryTab("products")}>
          + Novo pedido
        </button>
      </div>
      <div className="order-detail-head">
        <h2>#{selected.id}</h2>
        <span className="pill-warning">{selected.status}</span>
        <small>{selected.time}</small>
      </div>
      <div className="detail-customer">
        <h4>
          <UserRound size={15} /> Cliente
        </h4>
        <b>{selected.customer}</b>
        <small>
          <Phone size={14} /> {selected.phone}
        </small>
        <small>
          <MapPin size={14} /> {selected.address}
        </small>
      </div>
      <h4>Itens do pedido</h4>
      {selected.ids.map((it) => {
        const p = foodProducts.find((pr) => pr.id === it.id);
        return (
          p && (
            <div className="checkout-item" key={it.id}>
              <Image src={p.image} alt={p.name} width={160} height={160} />
              <span>
                <b>{p.name}</b>
                <small>{it.qty} unidade(s)</small>
              </span>
              <strong>{money(p.price * it.qty)}</strong>
            </div>
          )
        );
      })}
      <div className="total-bar">
        <b>Total do pedido</b>
        <strong>{money(selected.total)}</strong>
      </div>
      <div className="detail-customer">
        <h4>
          <CreditCard size={15} /> Pagamento
        </h4>
        <p>
          {selected.payment}{" "}
          <span className="success-label">
            <Check size={14} /> Confirmado
          </span>
        </p>
        <h4>
          <Bike size={15} /> Entrega
        </h4>
        <p>Entregador: {selected.driver || "Aguardando atribuição"}</p>
      </div>
      <div className="checkout-spacer" />
      <button
        className="primary-btn green-btn"
        disabled={selected.status === "Concluído"}
        onClick={() => changeOrder(selected.id)}
      >
        <Check size={20} />
        {selected.status === "Novo pedido"
          ? "Aceitar pedido"
          : selected.status === "Em preparo"
            ? "Enviar para entrega"
            : selected.status === "Saiu para entrega"
              ? "Concluir entrega"
              : "Pedido concluído"}
      </button>
    </>
  );
}
