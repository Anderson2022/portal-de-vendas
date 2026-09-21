import {
  BarChart3,
  Boxes,
  ClipboardList,
  RefreshCw,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Card, PageIntro } from "@/components/ui";

const groups = [
  {
    title: "Estoque",
    icon: Boxes,
    items: [
      "Posição atual",
      "Estoque por depósito",
      "Estoque por localização",
      "Estoque por categoria",
      "Estoque por marca",
      "Estoque por lote",
    ],
  },
  {
    title: "Movimentação",
    icon: RefreshCw,
    items: [
      "Entradas",
      "Saídas",
      "Transferências",
      "Ajustes de estoque",
      "Movimentação por usuário",
    ],
  },
  {
    title: "Gestão",
    icon: BarChart3,
    items: [
      "Curva ABC",
      "Giro de estoque",
      "Cobertura",
      "Estoque parado",
      "Rupturas",
      "Capital imobilizado",
    ],
  },
  {
    title: "Inventário",
    icon: ClipboardList,
    items: ["Acuracidade", "Divergências", "Ajustes de inventário"],
  },
  {
    title: "Validade",
    icon: Timer,
    items: ["Próximos do vencimento", "Produtos vencidos"],
  },
  {
    title: "Auditoria",
    icon: ShieldCheck,
    items: ["Operações por usuário", "Alterações por documento"],
  },
];

export default function StockReportsPage() {
  return (
    <div>
      <PageIntro
        crumbs={[
          { label: "Início", href: "/inicio" },
          { label: "Relatórios", href: "/relatorios" },
          { label: "Estoque" },
        ]}
        title="Relatórios de estoque"
        subtitle="Central de consultas e análises do estoque"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.title} className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <Icon size={19} />
                <h2 className="font-extrabold">{group.title}</h2>
              </div>
              <div className="grid gap-2">
                {group.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-xl bg-white/40 px-3 py-2 text-left text-sm font-semibold hover:bg-white/70"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
