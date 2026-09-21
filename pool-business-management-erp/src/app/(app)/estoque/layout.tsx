import ModuleShell, { type SideItem } from "@/components/module-shell";
const items: SideItem[] = [
  { href: "/estoque", label: "Visão geral", icon: "grid" },
  { href: "/estoque?f=posicao", label: "Posição de estoque", icon: "orders" },
  { href: "/estoque?f=alertas", label: "Alertas", icon: "sparkles" },
  { href: "/estoque?f=movimentacoes", label: "Movimentações", icon: "orders" },
  {
    href: "/estoque?f=transferencias",
    label: "Transferências",
    icon: "orders",
  },
  { href: "/estoque?f=inventarios", label: "Inventários", icon: "orders" },
  { href: "/estoque?f=reposicao", label: "Reposição", icon: "sparkles" },
  { href: "/estoque?f=lotes", label: "Lotes / Validades", icon: "orders" },
  { href: "/estoque?f=auditoria", label: "Auditoria", icon: "orders" },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleShell brand="estoque" moduleName="Estoque" items={items}>
      {children}
    </ModuleShell>
  );
}
