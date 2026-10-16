import type { DemoClient } from "./demo-client";
import type { DemoProduct } from "./demo-product";
import type { DemoSale } from "./demo-sale";
import type { DemoPayable } from "./demo-payable";
export type DemoState = {
  clients: DemoClient[];
  products: DemoProduct[];
  sales: DemoSale[];
  payables: DemoPayable[];
};
export type DemoSection =
  "inicio" | "clientes" | "estoque" | "vendas" | "financeiro";
