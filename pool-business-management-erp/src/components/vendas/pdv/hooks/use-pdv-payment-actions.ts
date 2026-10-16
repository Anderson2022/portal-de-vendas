"use client";
import { usePdvState } from "./use-pdv-state";
import { usePdvDerived } from "./use-pdv-derived";
import { usePdvCartActions } from "./use-pdv-cart-actions";
import type { Order } from "../types/order";
export function usePdvPaymentActions(
  state: ReturnType<typeof usePdvState> &
    ReturnType<typeof usePdvDerived> &
    ReturnType<typeof usePdvCartActions>,
) {
  const {
    currentCart,
    setReceived,
    total,
    setSplit,
    setModal,
    method,
    split,
    receivedValue,
    page,
    orders,
    client,
    deliverType,
    address,
    setOrders,
    setSelectedOrder,
    setDeliveryTab,
    message,
    clearCartSilently,
  } = state;
  function startPayment() {
    if (!currentCart.length) {
      message("Adicione produtos antes de finalizar.");
      return;
    }
    setReceived(total.toFixed(2).replace(".", ","));
    setSplit(false);
    setModal("payment");
  }
  function confirmPayment() {
    if (method === "Dinheiro" && !split && receivedValue < total) {
      message("O valor recebido é menor que o total.");
      return;
    }
    if (page === "delivery") {
      const novo: Order = {
        id: Math.max(...orders.map((o) => o.id)) + 1,
        time: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        customer: client || "Cliente balcão",
        phone: "(65) 99999-0000",
        address:
          deliverType === "Entrega"
            ? `${address.street || "Endereço não informado"}, ${address.number || "s/n"} - ${address.bairro || "Centro"}`
            : "Retirada no balcão",
        payment: method,
        status: "Novo pedido",
        total,
        ids: currentCart,
      };
      setOrders((prev) => [novo, ...prev]);
      setSelectedOrder(novo.id);
      setDeliveryTab("orders");
    }
    clearCartSilently();
    setModal(null);
    message(
      `✓ ${page === "delivery" ? "Pedido registrado" : "Venda finalizada"}! Pagamento ${method} confirmado.`,
    );
  }
  return { startPayment, confirmPayment };
}
