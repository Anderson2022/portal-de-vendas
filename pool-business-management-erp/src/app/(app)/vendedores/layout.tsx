import ModuleShell, { type SideItem } from "@/components/module-shell";

const items: SideItem[] = [
  { href: "/vendedores", label: "Visão geral", icon: "grid" },
  { href: "/vendedores?f=ranking", label: "Ranking", icon: "chart" },
  { href: "/vendedores?f=metas", label: "Metas e comissões", icon: "pie" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleShell brand="vendedores" moduleName="Vendedores" items={items}>
      {children}
    </ModuleShell>
  );
}
