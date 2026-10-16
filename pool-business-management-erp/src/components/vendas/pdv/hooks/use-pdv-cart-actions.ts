"use client";
import { usePdvState } from "./use-pdv-state";
import { usePdvDerived } from "./use-pdv-derived";
import type { Section } from "../types/section";
import { changeItems } from "../utils/change-items";
import { marketProducts } from "../constants/market-products";
export function usePdvCartActions(
  state: ReturnType<typeof usePdvState> & ReturnType<typeof usePdvDerived>,
) {
  const {
    setToast,
    setPage,
    setCategory,
    setSearch,
    setSidebar,
    setModal,
    activeMode,
    setTableCarts,
    table,
    setCart,
    page,
    setDiscount,
    scan,
    setScan,
    setOrders,
  } = state;
  const message = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(""), 3200);
  };
  function navigate(next: Section) {
    setPage(next);
    setCategory("Todos");
    setSearch("");
    setSidebar(false);
    setModal(null);
  }
  function updateQty(id: string, diff: number, mode = activeMode) {
    if (mode === "mesas")
      setTableCarts((prev) => ({
        ...prev,
        [table]: changeItems(prev[table] || [], id, diff),
      }));
    else
      setCart((prev) => ({
        ...prev,
        [mode]: changeItems(prev[mode] || [], id, diff),
      }));
  }
  function clearCart() {
    if (page === "mesas") setTableCarts((prev) => ({ ...prev, [table]: [] }));
    else setCart((prev) => ({ ...prev, [activeMode]: [] }));
    setDiscount(0);
    message("Venda atual limpa.");
  }
  function scanProduct() {
    const found = marketProducts.find(
      (p) =>
        p.barcode === scan.trim() ||
        p.name.toLowerCase().includes(scan.toLowerCase()),
    );
    if (found) {
      updateQty(found.id, 1);
      message(`${found.name} adicionado`);
      setScan("");
    } else message("Produto não encontrado. Confira o código.");
  }
  function clearCartSilently() {
    if (page === "mesas") setTableCarts((prev) => ({ ...prev, [table]: [] }));
    else setCart((prev) => ({ ...prev, [activeMode]: [] }));
    setDiscount(0);
  }
  function changeOrder(id: number) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status:
                o.status === "Novo pedido"
                  ? "Em preparo"
                  : o.status === "Em preparo"
                    ? "Saiu para entrega"
                    : o.status === "Saiu para entrega"
                      ? "Concluído"
                      : "Concluído",
              driver: o.status === "Em preparo" ? "Lucas" : o.driver,
            }
          : o,
      ),
    );
    message("Status do pedido atualizado.");
  }
  return {
    message,
    navigate,
    updateQty,
    clearCart,
    scanProduct,
    clearCartSilently,
    changeOrder,
  };
}
