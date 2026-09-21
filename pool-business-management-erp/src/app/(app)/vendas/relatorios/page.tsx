import { ChartLine, ChartColumnBig, Users, Package } from "lucide-react";
import { Card, PageIntro, SectionTitle } from "@/components/ui";
import { AreaChart, BarsChart, HBars } from "@/components/charts";
import { reportsData } from "@/lib/queries";
import { brl, brlCompact, monthLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function VendasRelatoriosPage() {
  const r = await reportsData();

  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[{ label: "Início", href: "/inicio" }, { label: "Vendas", href: "/vendas" }, { label: "Relatórios" }]}
        title="Relatórios comerciais"
        subtitle="Faturamento, lucro e desempenho — últimos 12 meses."
      />

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Card className="fade-up p-6 xl:col-span-2" >
          <SectionTitle
            icon={<ChartLine size={17} strokeWidth={2.4} />}
            title="Faturamento × custo real (12 meses)"
          />
          <div className="mt-2 flex items-center gap-5 text-[12px] font-bold text-ink-500">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-water-500" /> Faturamento</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-ink-300" /> Custo das vendas</span>
          </div>
          <div className="mt-4">
            <AreaChart
              id="rev"
              data={r.series.map((s) => s.revenue)}
              data2={r.series.map((s) => s.cost)}
              format={brl}
            />
          </div>
        </Card>

        <Card className="fade-up p-6" >
          <SectionTitle icon={<ChartColumnBig size={17} strokeWidth={2.4} />} title="Lucro real por mês" />
          <div className="mt-4">
            <BarsChart id="prof" data={r.series.map((s) => ({ a: s.revenue, b: s.profit }))} format={brlCompact} />
          </div>
          <div className="mt-1 flex items-center gap-5 text-[12px] font-bold text-ink-500">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-water-500" /> Faturamento</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-mint-500" /> Lucro real</span>
          </div>
        </Card>

        <Card className="fade-up p-6" >
          <SectionTitle icon={<Users size={17} strokeWidth={2.4} />} title="Vendas por vendedor — maio" />
          <div className="mt-5">
            <HBars
              items={r.sellerTotals.map((s) => ({ label: s.name, value: s.total, sub: `${s.count} vendas no mês` }))}
              format={brl}
            />
          </div>
        </Card>

        <Card className="fade-up p-6 xl:col-span-2" >
          <SectionTitle icon={<Package size={17} strokeWidth={2.4} />} title="Produtos e serviços mais vendidos — maio" />
          <div className="mt-5">
            <HBars
              items={r.topProducts.map((p) => ({ label: p.name, value: p.total }))}
              format={brl}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
