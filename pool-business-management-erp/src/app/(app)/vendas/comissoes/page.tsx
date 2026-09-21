import { documentCode } from "@/lib/format";
import {
  HandCoins,
  Percent,
  Scale,
  Sparkles,
  CircleDollarSign,
} from "lucide-react";
import {
  Card,
  Badge,
  PageIntro,
  SectionTitle,
  Stat,
  Bar,
  Avatar,
} from "@/components/ui";
import { CommissionSimulator } from "@/components/dialogs";
import { commissionsList } from "@/lib/queries";
import { brl, n, pct } from "@/lib/format";

export const dynamic = "force-dynamic";

const rules = [
  {
    icon: <Percent size={18} strokeWidth={2.4} />,
    title: "Comissão padrão",
    desc: "Percentual fixo por vendedor sobre o valor da venda.",
    lines: ["Carla · 5%", "Ricardo · 5%", "Fernanda · 4,5%", "João · 4%"],
  },
  {
    icon: <CircleDollarSign size={18} strokeWidth={2.4} />,
    title: "Por categoria",
    desc: "Alíquotas diferentes conforme o mix vendido.",
    lines: ["Piscinas · 4%", "Químicos · 2%", "Motores · 3%", "Serviços · 5%"],
  },
  {
    icon: <Scale size={18} strokeWidth={2.4} />,
    title: "Por margem (recomendada)",
    desc: "Protege o lucro: desconto excessivo reduz a comissão.",
    lines: ["Margem < 15% → 1%", "Margem 15–25% → 3%", "Margem > 25% → 5%"],
  },
];

export default async function ComissoesPage() {
  const { rows, total, bySeller } = await commissionsList();
  const maxSeller = Math.max(...bySeller.map((s) => s.amount), 1);

  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[
          { label: "Início", href: "/inicio" },
          { label: "Vendas", href: "/vendas" },
          { label: "Comissões" },
        ]}
        title="Comissões"
        subtitle="Regras vivas — nada de percentual fixo gravado no código."
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat
          icon={<HandCoins size={22} strokeWidth={2.2} />}
          label="Comissões do mês"
          value={brl(total)}
        />
        <Stat
          icon={<Sparkles size={22} strokeWidth={2.2} />}
          label="Vendas comissionadas"
          value={String(rows.length)}
        />
        <Stat
          icon={<Scale size={22} strokeWidth={2.2} />}
          label="Alíquota média"
          value={pct(
            rows.length
              ? rows.reduce((a, r) => a + n(r.pct), 0) / rows.length
              : 0,
          )}
        />
      </div>

      {/* Regras */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {rules.map((r) => (
          <Card key={r.title} hover className="fade-up p-5">
            <div className="flex items-center gap-3">
              <div className="icon-tile !h-11 !w-11">{r.icon}</div>
              <div>
                <h3 className="text-[14.5px] font-extrabold text-ink-900">
                  {r.title}
                </h3>
                <p className="text-[12px] font-medium text-ink-300">{r.desc}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {r.lines.map((l) => (
                <span key={l} className="badge badge-blue">
                  {l}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        {/* Tabela */}
        <Card className="fade-up overflow-hidden p-6 pb-3">
          <SectionTitle
            icon={<HandCoins size={17} strokeWidth={2.4} />}
            title="Comissões por venda — maio"
          />
          <div className="-mx-6 mt-4 overflow-x-auto">
            <table className="tbl min-w-[640px]">
              <thead>
                <tr>
                  <th>Venda</th>
                  <th>Vendedor</th>
                  <th className="text-right">Valor da venda</th>
                  <th className="text-center">%</th>
                  <th className="text-right">Comissão</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="font-extrabold text-ink-900">
                      #{documentCode(r.saleNumber)}
                    </td>
                    <td className="font-semibold">{r.seller}</td>
                    <td className="text-right tabular-nums">
                      {brl(r.saleTotal)}
                    </td>
                    <td className="text-center font-bold tabular-nums text-ink-500">
                      {n(r.pct).toLocaleString("pt-BR")}%
                    </td>
                    <td className="text-right font-extrabold tabular-nums text-mint-600">
                      {brl(n(r.amount))}
                    </td>
                    <td>
                      <Badge tone={r.status === "PAGA" ? "green" : "blue"}>
                        {r.status === "PAGA" ? "Paga" : "Pendente"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-5">
          {/* Por vendedor */}
          <Card className="fade-up p-6">
            <SectionTitle
              icon={<CircleDollarSign size={17} strokeWidth={2.4} />}
              title="Acumulado por vendedor"
            />
            <div className="mt-5 space-y-5">
              {bySeller.map((s) => (
                <div key={s.name} className="flex items-center gap-3.5">
                  <Avatar name={s.name} size={38} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[13.5px] font-extrabold text-ink-900">
                        {s.name}
                      </span>
                      <span className="text-[13px] font-extrabold tabular-nums text-mint-600">
                        {brl(s.amount)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2.5">
                      <Bar
                        value={(s.amount / maxSeller) * 100}
                        tone="green"
                        className="flex-1"
                      />
                      <span className="text-[11px] font-bold text-ink-300">
                        {s.count} vendas
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Simulador */}
          <Card className="fade-up p-6">
            <SectionTitle
              icon={<Scale size={17} strokeWidth={2.4} />}
              title="Simulador — comissão por margem"
            />
            <div className="mt-5">
              <CommissionSimulator />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
