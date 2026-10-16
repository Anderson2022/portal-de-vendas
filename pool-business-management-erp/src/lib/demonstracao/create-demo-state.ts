import type { DemoState } from "./types/demo-state";

export function createDemoState(): DemoState {
  return {
    clients: [
      {
        id: "client-1",
        name: "Cliente Exemplo",
        email: "cliente@example.com",
        phone: "(65) 99999-0000",
      },
    ],
    products: [
      {
        id: "product-1",
        name: "Cloro granulado 10 kg",
        sku: "DEMO-001",
        quantity: 20,
        price: 189.9,
      },
      {
        id: "product-2",
        name: "Filtro para piscina",
        sku: "DEMO-002",
        quantity: 5,
        price: 849,
      },
    ],
    sales: [],
    payables: [],
  };
}
