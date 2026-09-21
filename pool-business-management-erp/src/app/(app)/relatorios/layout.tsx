import ModuleShell, { type SideItem } from "@/components/module-shell";

const items: SideItem[] = [
  { href: "/relatorios", label: "Visão geral", icon: "grid" },
  { href: "/vendas/relatorios", label: "Relatórios comerciais", icon: "chart" },
  {
    label: "Estoque",
    icon: "chart",
    children: [
      { href: "/relatorios/estoque/dashboard", label: "Dashboard" },
      { href: "/relatorios/estoque", label: "Relatórios" },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleShell brand="relatorios" moduleName="Relatórios" items={items}>
      {children}
    </ModuleShell>
  );
}
