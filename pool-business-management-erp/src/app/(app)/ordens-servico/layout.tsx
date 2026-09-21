import ModuleShell, { type SideItem } from "@/components/module-shell";

const items: SideItem[] = [
  { href: "/ordens-servico", label: "Todas as OS", icon: "grid" },
  { href: "/ordens-servico?f=hoje", label: "Agenda de hoje", icon: "sparkles" },
  { href: "/ordens-servico?f=instalacao", label: "Instalações", icon: "wrench" },
  { href: "/ordens-servico?f=manutencao", label: "Manutenção", icon: "settings" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleShell brand="ordens-servico" moduleName="Ordens de Serviço" items={items}>
      {children}
    </ModuleShell>
  );
}
