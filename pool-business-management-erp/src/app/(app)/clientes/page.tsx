import { Users, TrendingUp, Wallet, MapPin, Phone } from "lucide-react";
import { Card, Badge, PageIntro, SectionTitle, Stat, Avatar } from "@/components/ui";
import { NewClientButton } from "@/components/dialogs";
import { customersList } from "@/lib/queries";
import { brl, dateBR, MONTH } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ f?: string }>;
}) {
  const { f = "" } = await searchParams;
  const all = await customersList();
  const list =
    f === "novos" ? all.filter((c) => c.createdAt.startsWith(MONTH))
    : all; // "top" já vem ordenado por total comprado
  const news = all.filter((c) => c.createdAt.startsWith(MONTH)).length;
  const wallet = all.reduce((a, c) => a + c.totalBought, 0);

  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[{ label: "Início", href: "/inicio" }, { label: "Clientes" }]}
        title="Clientes"
        subtitle="Cadastros, histórico e relacionamento — cada piscina vendida é uma receita recorrente esperando."
        right={<NewClientButton variant="primary" />}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat icon={<Users size={22} strokeWidth={2.2} />} label="Base de clientes" value={String(all.length)} />
        <Stat icon={<TrendingUp size={22} strokeWidth={2.2} />} label="Novos em maio" value={String(news)} />
        <Stat icon={<Wallet size={22} strokeWidth={2.2} />} label="Receita acumulada" value={brl(wallet)} />
      </div>

      <Card className="fade-up mt-5 overflow-hidden p-6 pb-3" >
        <SectionTitle
          icon={<Users size={17} strokeWidth={2.4} />}
          title={f === "novos" ? "Novos clientes de maio" : f === "top" ? "Maiores compradores" : "Todos os clientes"}
        />
        <div className="-mx-6 mt-4 overflow-x-auto">
          <table className="tbl min-w-[900px]">
            <thead>
              <tr>
                <th>Cliente</th><th>Contato</th><th>Endereço</th>
                <th className="text-center">Compras</th><th>Última compra</th><th className="text-right">Total comprado</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} size={36} />
                      <div>
                        <div className="flex items-center gap-2 font-extrabold text-ink-900">
                          {c.name}
                          {c.createdAt.startsWith(MONTH) && <Badge tone="blue">Novo</Badge>}
                        </div>
                        <div className="text-[11.5px] font-medium text-ink-300">{c.document ?? `Desde ${dateBR(c.createdAt)}`}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-700"><Phone size={11} />{c.phone ?? "—"}</div>
                    <div className="text-[11.5px] text-ink-300">{c.email ?? ""}</div>
                  </td>
                  <td>
                    <div className="flex max-w-[220px] items-center gap-1.5 text-[12.5px] text-ink-500">
                      <MapPin size={11} className="shrink-0 text-ink-300" />
                      <span className="truncate">{c.address ? `${c.address} · ${c.city}/${c.state}` : c.city ? `${c.city}/${c.state}` : "—"}</span>
                    </div>
                  </td>
                  <td className="text-center font-extrabold tabular-nums">{c.purchases}</td>
                  <td className="tabular-nums text-ink-500">{c.lastPurchase ? dateBR(c.lastPurchase) : "—"}</td>
                  <td className="text-right font-extrabold tabular-nums text-ink-900">{brl(c.totalBought)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <div className="py-14 text-center text-[13.5px] font-semibold text-ink-300">
              Nenhum cliente encontrado.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
