import type { Section } from "../types/section";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  Package,
  Search,
  BarChart3,
  Truck,
  Wallet,
  Gift,
  Users,
  Settings,
} from "lucide-react";
export const sideLinks: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "lancamento", label: "Vendas", icon: ChartNoAxesColumnIncreasing },
  { id: "pedidos", label: "Pedidos", icon: ClipboardList },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "clientes", label: "Clientes", icon: Search },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "entregas", label: "Entrega em tempo real", icon: Truck },
  { id: "financeiro", label: "Financeiro", icon: Wallet },
  { id: "promocoes", label: "Promoções", icon: Gift },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];
