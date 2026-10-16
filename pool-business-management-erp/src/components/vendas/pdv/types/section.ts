import type { Mode } from "./mode";
export type Section =
  | Mode
  | "pedidos"
  | "produtos"
  | "clientes"
  | "relatorios"
  | "entregas"
  | "financeiro"
  | "promocoes"
  | "usuarios"
  | "configuracoes";
