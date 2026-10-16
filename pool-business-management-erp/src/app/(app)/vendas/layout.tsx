"use client";

import ModuleShell, { type SideItem } from "@/components/module-shell";
import { PdvSidebarClock } from "@/components/vendas/pdv/views/pdv-sidebar-clock";
import { usePathname } from "next/navigation";

const items: SideItem[] = [
  { href: "/vendas", label: "Visão geral", icon: "grid" },
  { href: "/vendas/orcamentos", label: "Orçamentos", icon: "file" },
  { href: "/vendas/pedidos", label: "Pedidos", icon: "orders" },
  { href: "/vendas/custos", label: "Custos da venda", icon: "pie" },
  { href: "/vendas/comissoes", label: "Comissões", icon: "coins" },
  { href: "/vendas/clientes", label: "Clientes", icon: "users" },
  { href: "/vendas/relatorios", label: "Relatórios", icon: "chart" },
];

export default function VendasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ModuleShell
      brand="vendas"
      moduleName="Vendas"
      items={items}
      sideBottom={pathname === "/vendas" ? <PdvSidebarClock /> : undefined}
      contentClassName={
        pathname === "/vendas" ? "px-3 pb-8 pt-2 sm:px-4" : undefined
      }
    >
      {children}
    </ModuleShell>
  );
}
