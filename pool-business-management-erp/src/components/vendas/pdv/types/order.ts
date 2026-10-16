import type { PayMethod } from "./pay-method";
import type { OrderStatus } from "./order-status";
import type { Item } from "./item";
export type Order = {
  id: number;
  time: string;
  customer: string;
  phone: string;
  address: string;
  payment: PayMethod;
  status: OrderStatus;
  total: number;
  ids: Item[];
  driver?: string;
};
