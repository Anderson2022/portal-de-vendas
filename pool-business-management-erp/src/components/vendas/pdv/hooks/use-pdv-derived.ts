import { usePdvState } from "./use-pdv-state";
import type { Mode } from "../types/mode";
import { isMode } from "../utils/is-mode";
import { foodProducts } from "../constants/food-products";
import { serviceProducts } from "../constants/service-products";
import { marketProducts } from "../constants/market-products";
import type { Item } from "../types/item";
import type { Product } from "../types/product";
import type { OrderStatus } from "../types/order-status";
import { sideLinks } from "../constants/side-links";
import { modes } from "../constants/modes";
export function usePdvDerived(state: ReturnType<typeof usePdvState>) {
  const {
    page,
    tableCarts,
    table,
    cart,
    deliverType,
    discount,
    category,
    search,
    orders,
    selectedOrder,
    received,
  } = state;
  const activeMode: Mode = isMode(page)
    ? page === "home"
      ? "lancamento"
      : page
    : "lancamento";
  const products =
    page === "delivery" || page === "mesas"
      ? foodProducts
      : page === "servicos"
        ? serviceProducts
        : marketProducts;
  const currentCart =
    page === "mesas" ? tableCarts[table] || [] : cart[activeMode] || [];
  const lineItems = currentCart
    .map((it) => ({ item: it, product: products.find((p) => p.id === it.id) }))
    .filter((v): v is { item: Item; product: Product } => !!v.product);
  const subtotal = lineItems.reduce(
    (s, { product, item }) => s + item.qty * product.price,
    0,
  );
  const deliveryFee = page === "delivery" && deliverType === "Entrega" ? 8 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const visible = products.filter(
    (p) =>
      (category === "Todos" || p.category === category) &&
      `${p.name} ${p.barcode || ""} ${p.category}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const selected = orders.find((o) => o.id === selectedOrder) || orders[0];
  const receivedValue =
    Number(received.replace(/\./g, "").replace(",", ".")) || 0;
  const statuses: OrderStatus[] = [
    "Novo pedido",
    "Em preparo",
    "Saiu para entrega",
    "Concluído",
  ];
  const pageTitle =
    sideLinks.find((s) => s.id === page)?.label ||
    modes.find((m) => m.id === page)?.label ||
    "PDV";
  return {
    activeMode,
    products,
    currentCart,
    lineItems,
    subtotal,
    deliveryFee,
    total,
    visible,
    selected,
    receivedValue,
    statuses,
    pageTitle,
  };
}
