import ModuleShell, { type SideItem } from "@/components/module-shell";

const items: SideItem[] = [
  { href: "/clientes", label: "Visão geral", icon: "grid" },
  { href: "/clientes?f=top", label: "Maiores compradores", icon: "chart" },
  { href: "/clientes?f=novos", label: "Novos no mês", icon: "sparkles" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleShell brand="clientes" moduleName="Clientes" items={items}>
      {children}
    </ModuleShell>
  );
}
