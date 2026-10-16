import type { DemoState } from "./types/demo-state";

export function createDemoSale(
  state: DemoState,
  clientId: string,
  productId: string,
  quantity: number,
): DemoState {
  const product = state.products.find((item) => item.id === productId);
  if (!state.clients.some((client) => client.id === clientId))
    throw new Error("Selecione um cliente.");
  if (
    !product ||
    !Number.isSafeInteger(quantity) ||
    quantity <= 0 ||
    quantity > product.quantity
  )
    throw new Error("Verifique o produto e a quantidade disponível.");
  return {
    ...state,
    products: state.products.map((item) =>
      item.id === productId
        ? { ...item, quantity: item.quantity - quantity }
        : item,
    ),
    sales: [
      ...state.sales,
      {
        id: crypto.randomUUID(),
        clientId,
        productId,
        quantity,
        total: Math.round(product.price * quantity * 100) / 100,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}
