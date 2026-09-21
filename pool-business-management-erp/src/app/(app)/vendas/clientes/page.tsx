import { Users, TrendingUp, ShoppingBag } from "lucide-react";
import { Card, PageIntro, SectionTitle, Stat, Avatar } from "@/components/ui";
import { NewClientButton } from "@/components/dialogs";
import { customersList } from "@/lib/queries";
import { brl, dateShort, n, MONTH } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function VendasClientesPage() {
  const list = await customersList();
  const news = list.filter((c) => c.createdAt.startsWith(MONTH)).length;
  const active = list.filter((c) => c.purchases > 0).length;

  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[{ label: "Início", href: "/inicio" }, { label: "Vendas", href: "/vendas" }, { label: "Clientes" }]}
        title="Clientes"
        subtitle="Relacionamento que gera receita recorrente — químicos, manutenção e reformas."
        right={<NewClientButton variant="primary" />}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat icon={<Users size={22} strokeWidth={2.2} />} label="Base de clientes" value={String(list.length)} />
        <Stat icon={<TrendingUp size={22} strokeWidth={2.2} />} label="Novos no mês" value={String(news)} />
        <Stat icon={<ShoppingBag size={22} strokeWidth={2.2} />} label="Com histórico de compra" value={String(active)} />
      </div>

      <Card className="fade-up mt-5 overflow-hidden p-6 pb-3" >
        <SectionTitle icon={<Users size={17} strokeWidth={2.4} />} title="Clientes que mais compram" />
        <div className="-mx-6 mt-4 overflow-x-auto">
          <table className="tbl min-w-[820px]">
            <thead>
              <tr><th>Cliente</th><th>Contato</th><th>Cidade</th><th className="text-center">Compras</th><th>Última compra</th><th className="text-right">Total comprado</th></tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} size={34} />
                      <div>
                        <div className="font-extrabold text-ink-900">{c.name}</div>
                        <div className="text-[11.5px] font-medium text-ink-300">desde {dateShort(c.createdAt)}/{c.createdAt.slice(0, 4)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-[12.5px] font-semibold text-ink-700">{c.phone ?? "—"}</div>
                    <div className="text-[11.5px] text-ink-300">{c.email ?? ""}</div>
                  </td>
                  <td className="text-ink-500">{c.city ? `${c.city}/${c.state}` : "—"}</td>
                  <td className="text-center font-extrabold tabular-nums text-ink-900">{c.purchases}</td>
                  <td className="tabular-nums text-ink-500">{c.lastPurchase ? dateShort(c.lastPurchase) : "—"}</td>
                  <td className="text-right font-extrabold tabular-nums text-ink-900">{brl(c.totalBought)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
