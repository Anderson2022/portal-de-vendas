import {
  ShoppingCart,
  CreditCard,
  UtensilsCrossed,
  ShoppingBasket,
  Scissors,
  Bike,
  Search,
  Store,
} from "lucide-react";
import { usePdv } from "../pdv-context";

export function PdvOperationToolbar() {
  const { page, scannerRef, setShopOpen, shopOpen } = usePdv();
  return (
    <div
      className="pdv-operation-toolbar"
      role="toolbar"
      aria-label="Operação do PDV"
    >
      <div className="mode-tabs">
        {[
          { id: "lancamento", text: "Lançamento", icon: ShoppingCart },
          { id: "cartao", text: "Cartão", icon: CreditCard },
          { id: "mesas", text: "Mesas", icon: UtensilsCrossed },
          {
            id: "supermercado",
            text: "Supermercado",
            icon: ShoppingBasket,
          },
          { id: "servicos", text: "Serviços", icon: Scissors },
          { id: "delivery", text: "Delivery", icon: Bike },
        ]
          .filter(({ id }) => id === page)
          .map(({ id, text, icon: Icon }) => (
            <button
              key={id}
              className={`mode-tab ${page === id ? "active" : ""}`}
              aria-current="page"
            >
              <Icon size={16} />
              <span>{text}</span>
            </button>
          ))}
      </div>
      <button
        className="work-search-button"
        onClick={() => scannerRef.current?.focus()}
      >
        <Search size={17} />
        <span>Buscar produtos ou serviços...</span>
        <kbd>F2</kbd>
      </button>
      <button className="cashier" onClick={() => setShopOpen(!shopOpen)}>
        <Store size={15} /> Caixa 01{" "}
        <span>● {shopOpen ? "Aberto" : "Fechado"}</span>
      </button>
    </div>
  );
}
