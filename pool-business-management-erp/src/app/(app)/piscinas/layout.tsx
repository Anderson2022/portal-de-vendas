import ModuleShell, { type SideItem } from "@/components/module-shell";

const items: SideItem[] = [
  { href: "/piscinas", label: "Modelos", icon: "grid" },
  { href: "/piscinas?f=volume", label: "Por volume", icon: "waves" },
  { href: "/piscinas?f=garantia", label: "Garantias", icon: "sparkles" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleShell brand="piscinas" moduleName="Piscinas" items={items}>
      {children}
    </ModuleShell>
  );
}
