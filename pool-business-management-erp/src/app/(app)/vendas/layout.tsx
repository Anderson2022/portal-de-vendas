import ModuleShell, { type SideItem } from "@/components/module-shell";
import { Quote } from "lucide-react";

const items: SideItem[] = [
  { href: "/vendas", label: "Visão geral", icon: "grid" },
  { href: "/vendas/orcamentos", label: "Orçamentos", icon: "file" },
  { href: "/vendas/pedidos", label: "Pedidos", icon: "orders" },
  { href: "/vendas/custos", label: "Custos da venda", icon: "pie" },
  { href: "/vendas/comissoes", label: "Comissões", icon: "coins" },
  { href: "/vendas/clientes", label: "Clientes", icon: "users" },
  { href: "/vendas/relatorios", label: "Relatórios", icon: "chart" },
];

export default function VendasLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleShell
      brand="vendas"
      moduleName="Vendas"
      items={items}
      sideFooter={
        <div
          className="relative overflow-hidden rounded-[22px] p-5"
          style={{
            backgroundImage: "url(/images/water-caustics.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.8), 0 14px 28px -14px rgba(13,132,192,.5)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/55 to-white/25" />
          <div className="relative">
            <Quote size={18} className="text-water-600" />
            <p className="font-display mt-2 text-[19px] leading-snug text-ink-900">
              Mais negócios hoje. Mais piscinas amanhã.
            </p>
            <div className="mt-3 text-[8.5px] font-extrabold tracking-[0.3em] text-ink-500">POOLCONTROL</div>
          </div>
        </div>
      }
    >
      {children}
    </ModuleShell>
  );
}
