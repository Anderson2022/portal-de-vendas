import ModuleShell, { type SideItem } from "@/components/module-shell";

const items: SideItem[] = [
  { href: "/ajustes/financeiro", label: "Financeiro", icon: "bank" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleShell brand="ajustes" moduleName="Configurações" items={items}>
      {children}
    </ModuleShell>
  );
}
