import ModuleShell, { type SideItem } from "@/components/module-shell";

const items: SideItem[] = [
  { href: "/configuracoes", label: "Segurança", icon: "settings" },
  { href: "/configuracoes?f=usuarios", label: "Usuários", icon: "users" },
  {
    href: "/configuracoes?f=permissoes",
    label: "Permissões",
    icon: "settings",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleShell brand="configuracoes" moduleName="Segurança" items={items}>
      {children}
    </ModuleShell>
  );
}
