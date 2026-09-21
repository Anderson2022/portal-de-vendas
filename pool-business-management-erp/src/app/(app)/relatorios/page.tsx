import {
  Banknote,
  Scale,
  TrendingUp,
  Receipt,
  Wallet,
  ShoppingCart,
  BadgeDollarSign,
  Percent,
  HandCoins,
  ChartLine,
  Package,
  Users,
  Boxes,
  TriangleAlert,
  Trophy,
} from "lucide-react";
import { Card, Badge, PageIntro, SectionTitle, Avatar } from "@/components/ui";
import { AreaChart, BarsChart, HBars, Donut } from "@/components/charts";
import { reportsData } from "@/lib/queries";
import { brl, brlCompact, pct } from "@/lib/format";

export const dynamic = "force-dynamic";

const moneyCls = "mt-1 text-[24px] font-extrabold tabular-nums tracking-tight";

export default async function RelatoriosPage() {
  const r = await reportsData();
  const donutColors = ["#0d84c0", "#45bce9", "#1fb470", "#e7a13b", "#8ba9c4"];
  const money = [
    {
      label: "Faturamento do mês",
      value: brl(r.month.revenue),
      icon: <Banknote size={20} strokeWidth={2.2} />,
      cls: "text-ink-950",
    },
    {
      label: "Custo das vendas",
      value: brl(r.month.cost),
      icon: <Scale size={20} strokeWidth={2.2} />,
      cls: "text-ink-700",
    },
    {
      label: "Lucro bruto",
      value: brl(r.month.profit),
      icon: <TrendingUp size={20} strokeWidth={2.2} />,
      cls: "text-ink-950",
    },
    {
      label: "Despesas operacionais",
      value: brl(r.opExpenses),
      icon: <Receipt size={20} strokeWidth={2.2} />,
      cls: "text-ink-700",
    },
    {
      label: "Lucro líquido",
      value: brl(r.netProfit),
      icon: <Wallet size={20} strokeWidth={2.2} />,
      cls: "text-mint-600",
      hot: true,
    },
  ];
  const quick = [
    {
      label: "Vendas",
      value: String(r.salesCount),
      icon: <ShoppingCart size={18} strokeWidth={2.4} />,
    },
    {
      label: "Ticket médio",
      value: brl(r.ticketAvg),
      icon: <BadgeDollarSign size={18} strokeWidth={2.4} />,
    },
    {
      label: "Margem média",
      value: pct(r.marginAvg),
      icon: <Percent size={18} strokeWidth={2.4} />,
    },
    {
      label: "Comissões",
      value: brl(r.commissionsMonth),
      icon: <HandCoins size={18} strokeWidth={2.4} />,
    },
  ];

  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[{ label: "Início", href: "/inicio" }, { label: "Relatórios" }]}
        title="Relatórios"
        subtitle="A empresa inteira em números claros. Primeiro, dinheiro."
      />

      {/* Dinheiro em primeiro lugar */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {money.map((m) => (
          <Card
            key={m.label}
            hover
            className={`fade-up p-5 ${m.hot ? "!bg-gradient-to-b !from-mint-100/90 !to-white/70" : ""}`}
          >
            <div
              className={`icon-tile ${m.hot ? "!from-mint-100 !to-mint-100/60 !text-mint-600" : ""}`}
            >
              {m.icon}
            </div>
            <div className="mt-3 text-[12.5px] font-semibold text-ink-500">
              {m.label}
            </div>
            <div className={`${moneyCls} ${m.cls}`}>{m.value}</div>
            {m.hot && (
              <div className="mt-1 text-[11.5px] font-bold text-mint-600">
                após despesas operacionais
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {quick.map((q) => (
          <Card key={q.label} className="fade-up flex items-center gap-3.5 p-4">
            <div className="icon-tile !h-10 !w-10 !rounded-xl">{q.icon}</div>
            <div>
              <div className="text-[12px] font-semibold text-ink-500">
                {q.label}
              </div>
              <div className="text-[18px] font-extrabold tabular-nums text-ink-950">
                {q.value}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Card className="fade-up p-6">
          <SectionTitle
            icon={<ChartLine size={17} strokeWidth={2.4} />}
            title="Faturamento por mês — 12 meses"
          />
          <div className="mt-4">
            <AreaChart
              id="rep"
              data={r.series.map((s) => s.revenue)}
              format={brl}
            />
          </div>
        </Card>
        <Card className="fade-up p-6">
          <SectionTitle
            icon={<Trophy size={17} strokeWidth={2.4} />}
            title="Participação por vendedor"
          />
          <div className="mt-5 flex justify-center">
            <Donut
              centerValue={brlCompact(r.month.revenue)}
              centerLabel="maio/2026"
              parts={r.sellerTotals.map((s, i) => ({
                label: s.name.split(" ")[0],
                value: s.total,
                color: donutColors[i % donutColors.length],
              }))}
            />
          </div>
        </Card>
        <Card className="fade-up p-6">
          <SectionTitle
            icon={<TrendingUp size={17} strokeWidth={2.4} />}
            title="Lucro real por mês"
          />
          <div className="mt-4">
            <BarsChart
              id="rep2"
              data={r.series.map((s) => ({ a: s.profit }))}
              format={brlCompact}
            />
          </div>
        </Card>
        <Card className="fade-up p-6">
          <SectionTitle
            icon={<Package size={17} strokeWidth={2.4} />}
            title="Produtos e serviços mais vendidos"
          />
          <div className="mt-5">
            <HBars
              items={r.topProducts.map((p) => ({
                label: p.name,
                value: p.total,
              }))}
              format={brl}
            />
          </div>
        </Card>
      </div>

      {/* Listas operacionais */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="fade-up p-6">
          <SectionTitle
            icon={<Users size={17} strokeWidth={2.4} />}
            title="Clientes que mais compram"
          />
          <div className="mt-4 space-y-1">
            {r.topCustomers.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-water-50/60"
              >
                <span className="w-5 text-[12px] font-extrabold text-ink-300">
                  {i + 1}º
                </span>
                <Avatar name={c.name} size={32} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-ink-900">
                  {c.name}
                </span>
                <span className="text-[13px] font-extrabold tabular-nums text-ink-900">
                  {brl(c.total)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="fade-up p-6">
          <SectionTitle
            icon={<Boxes size={17} strokeWidth={2.4} />}
            title="Estoque crítico"
            action={{ label: "Ir ao estoque", href: "/estoque?f=alertas" }}
          />
          <div className="mt-4 space-y-2">
            {r.critical.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-coral-100/50 px-3.5 py-2.5"
              >
                <span className="truncate text-[13px] font-bold text-ink-900">
                  {p.name}
                </span>
                <span className="ml-3 shrink-0 text-[12px] font-extrabold text-coral-500">
                  disp. {p.available} / mín. {p.minStock}
                </span>
              </div>
            ))}
            {r.critical.length === 0 && (
              <div className="py-6 text-center text-[13px] font-semibold text-ink-300">
                Estoque saudável.
              </div>
            )}
          </div>
        </Card>

        <Card className="fade-up p-6">
          <SectionTitle
            icon={<TriangleAlert size={17} strokeWidth={2.4} />}
            title="Contas vencidas"
            action={{ label: "Ir ao financeiro", href: "/financeiro" }}
          />
          <div className="mt-4 space-y-2">
            {r.overdue.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-xl bg-sun-100/60 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-bold text-ink-900">
                    {o.description}
                  </div>
                  <div className="text-[11.5px] text-ink-300">{o.customer}</div>
                </div>
                <div className="ml-3 text-right">
                  <div className="text-[13px] font-extrabold tabular-nums text-ink-900">
                    {brl(Number(o.amount))}
                  </div>
                  <Badge tone="red">Vencido</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
