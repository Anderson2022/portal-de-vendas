import type { Section } from "../types/section";
import type { Order } from "../types/order";
export type UtilityProps = {
  page: Section;
  pageTitle: string;
  navigate: (p: Section) => void;
  message: (m: string) => void;
  orders: Order[];
  dataFilter: string;
  setDataFilter: (s: string) => void;
  newClients: string[];
  setModal: (v: "customer" | "settings") => void;
};
