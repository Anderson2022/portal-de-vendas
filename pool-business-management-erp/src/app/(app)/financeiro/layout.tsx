import ModuleShell, { type SideItem } from "@/components/module-shell";

const items: SideItem[] = [
  { href: "/financeiro", label: "Visão geral", icon: "grid" },
  { href: "/financeiro?f=receber", label: "Contas a receber", icon: "coins" },
  { href: "/financeiro?f=pagar", label: "Contas a pagar", icon: "file" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleShell brand="financeiro" moduleName="Financeiro" items={items}>
      {children}
    </ModuleShell>
  );
}
