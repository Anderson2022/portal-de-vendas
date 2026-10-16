import type { Mode } from "../types/mode";
import type { LucideIcon } from "lucide-react";
import {
  ShoppingCart,
  UtensilsCrossed,
  Bike,
  Scissors,
  ShoppingBasket,
} from "lucide-react";
export const modes: {
  id: Mode;
  label: string;
  icon: LucideIcon;
  color: string;
  desc: string;
}[] = [
  {
    id: "lancamento",
    label: "PDV",
    icon: ShoppingCart,
    color: "blue",
    desc: "Vendas rápidas no balcão com produtos e categorias.",
  },
  {
    id: "mesas",
    label: "Mesas",
    icon: UtensilsCrossed,
    color: "amber",
    desc: "Controle de mesas, consumo e fechamento.",
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: Bike,
    color: "red",
    desc: "Pedidos para entrega, retirada e balcão.",
  },
  {
    id: "servicos",
    label: "Serviços",
    icon: Scissors,
    color: "purple",
    desc: "Agendamento, profissionais e controle de serviços.",
  },
  {
    id: "supermercado",
    label: "Supermercado",
    icon: ShoppingBasket,
    color: "green",
    desc: "Vendas em grande volume com leitor de código de barras.",
  },
];
