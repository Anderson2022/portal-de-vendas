import { Package, Users, ShoppingCart, Wallet } from "lucide-react";
import { Stat } from "@/components/ui/stat";
import { Card } from "@/components/ui/card";
import { PageIntro } from "@/components/ui/page-intro";
import { brl } from "@/lib/format";
import type { DemoState } from "@/lib/demonstracao/types/demo-state";

export function DemoOverview({ state }: { state: DemoState }) {
  return (
    <>
      <PageIntro
        crumbs={[{ label: "Demonstração" }, { label: "Início" }]}
        title="Olá, visitante"
        subtitle="Explore os cadastros e simule operações com dados de exemplo."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<Users />}
          label="Clientes"
          value={String(state.clients.length)}
        />
        <Stat
          icon={<Package />}
          label="Itens em estoque"
          value={String(state.products.reduce((n, p) => n + p.quantity, 0))}
        />
        <Stat
          icon={<ShoppingCart />}
          label="Vendas simuladas"
          value={brl(state.sales.reduce((n, s) => n + s.total, 0))}
        />
        <Stat
          icon={<Wallet />}
          label="Contas em aberto"
          value={brl(
            state.payables
              .filter((p) => !p.paid)
              .reduce((n, p) => n + p.amount, 0),
          )}
        />
      </div>
      <Card className="mt-6 p-6">
        <h2 className="font-extrabold">Seu espaço de apresentação</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Cadastre clientes e produtos, simule vendas com baixa de estoque e
          experimente contas a pagar. As alterações ficam apenas neste navegador
          e são descartadas ao sair ou reiniciar a demonstração.
        </p>
      </Card>
    </>
  );
}
