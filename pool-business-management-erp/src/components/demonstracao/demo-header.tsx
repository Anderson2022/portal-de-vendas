import { Waves, LogOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DemoSection } from "@/lib/demonstracao/types/demo-state";

const sections: { id: DemoSection; label: string }[] = [
  { id: "inicio", label: "Início" },
  { id: "clientes", label: "Clientes" },
  { id: "estoque", label: "Estoque" },
  { id: "vendas", label: "Vendas" },
  { id: "financeiro", label: "Financeiro" },
];

export function DemoHeader({
  section,
  onSelect,
  onReset,
  onExit,
}: {
  section: DemoSection;
  onSelect: (section: DemoSection) => void;
  onReset: () => void;
  onExit: () => void;
}) {
  return (
    <header className="border-b border-white/60 px-6 py-4">
      <div className="mx-auto flex max-w-[1460px] flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Waves className="text-water-600" size={30} />
          <span className="text-xl font-extrabold">
            Pool<span className="text-water-600">Control</span>
          </span>
          <span className="rounded-full bg-water-100 px-3 py-1 text-xs font-bold text-water-700">
            Demonstração
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={onReset}>
            <RotateCcw size={15} />
            Reiniciar
          </Button>
          <Button onClick={onExit}>
            <LogOut size={15} />
            Sair
          </Button>
        </div>
      </div>
      <nav
        aria-label="Módulos da demonstração"
        className="mx-auto mt-5 flex max-w-[1460px] flex-wrap gap-2"
      >
        {sections.map((item) => (
          <Button
            key={item.id}
            variant={section === item.id ? "primary" : "secondary"}
            aria-current={section === item.id ? "page" : undefined}
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </nav>
    </header>
  );
}
