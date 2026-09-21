import { documentCode } from "@/lib/format";
import { ChartPie, Scale, TrendingUp, Receipt } from "lucide-react";
import { Card, PageIntro, SectionTitle, Stat, Bar } from "@/components/ui";
import { marginsList } from "@/lib/queries";
import { brl, dateShort, n, pct } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CustosPage() {
  const { month, totals } = await marginsList();
  const marginAvg =
    totals.revenue > 0 ? (totals.profit / totals.revenue) * 100 : 0;

  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[
          { label: "Início", href: "/inicio" },
          { label: "Vendas", href: "/vendas" },
          { label: "Custos da venda" },
        ]}
        title="Custos da venda"
        subtitle="Venda não é faturamento. Venda boa é venda com margem."
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat
          icon={<Receipt size={22} strokeWidth={2.2} />}
          label="Faturamento"
          value={brl(totals.revenue)}
        />
        <Stat
          icon={<Scale size={22} strokeWidth={2.2} />}
          label="Custo total"
          value={brl(totals.cost)}
          accent={
            <div className="mt-1 text-xs font-bold text-ink-300">
              {pct(
                totals.revenue > 0 ? (totals.cost / totals.revenue) * 100 : 0,
              )}{" "}
              do faturamento
            </div>
          }
        />
        <Stat
          icon={<TrendingUp size={22} strokeWidth={2.2} />}
          label="Lucro real"
          value={brl(totals.profit)}
          accent={
            <div className="mt-1 text-xs font-bold text-mint-600">
              {pct(marginAvg)} de margem
            </div>
          }
        />
      </div>

      <Card className="fade-up mt-5 overflow-hidden p-6 pb-3">
        <SectionTitle
          icon={<ChartPie size={17} strokeWidth={2.4} />}
          title="Margem por venda — maio de 2026"
        />
        <div className="-mx-6 mt-4 overflow-x-auto">
          <table className="tbl min-w-[900px]">
            <thead>
              <tr>
                <th>#</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th className="text-right">Venda</th>
                <th className="text-right">Custo real</th>
                <th className="text-right">Lucro</th>
                <th className="min-w-[190px]">Margem</th>
              </tr>
            </thead>
            <tbody>
              {month.map((s) => {
                const m = n(s.margin);
                const tone =
                  m >= 25
                    ? "text-mint-600"
                    : m >= 15
                      ? "text-[#b57708]"
                      : "text-coral-500";
                const barTone = m >= 25 ? "green" : "amber";
                return (
                  <tr key={s.id}>
                    <td className="font-extrabold text-ink-900">
                      #{documentCode(s.number)}
                    </td>
                    <td className="tabular-nums text-ink-500">
                      {dateShort(s.saleDate)}
                    </td>
                    <td className="font-semibold">{s.customer}</td>
                    <td className="text-ink-500">{s.seller}</td>
                    <td className="text-right font-bold tabular-nums">
                      {brl(n(s.totalValue))}
                    </td>
                    <td className="text-right tabular-nums text-ink-500">
                      {brl(n(s.totalCost))}
                    </td>
                    <td
                      className={`text-right font-extrabold tabular-nums ${tone}`}
                    >
                      {brl(n(s.profit))}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Bar
                          value={m * 2.4}
                          tone={barTone}
                          className="flex-1"
                        />
                        <span
                          className={`w-12 text-right text-[12.5px] font-extrabold tabular-nums ${tone}`}
                        >
                          {pct(m)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="fade-up mt-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <h3 className="text-[15px] font-extrabold text-ink-900">
              Como o custo é composto
            </h3>
            <p className="mt-1 text-[13px] font-medium leading-relaxed text-ink-500">
              Cada venda consolida custo dos produtos, frete, instalação,
              comissão do vendedor, taxas de cartão e impostos em{" "}
              <b className="text-ink-900">sale_costs</b> — linhas flexíveis que
              aceitam qualquer novo tipo de custo.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Produtos",
              "Frete",
              "Instalação",
              "Comissão",
              "Taxas",
              "Impostos",
              "Outros",
            ].map((t) => (
              <span key={t} className="badge badge-blue">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
