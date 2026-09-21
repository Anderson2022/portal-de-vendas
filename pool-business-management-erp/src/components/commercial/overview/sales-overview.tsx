import { Card } from "@/components/ui";
import { FeaturedSaleCosts } from "./featured-sale-costs";
import { RecentQuotes } from "./recent-quotes";
import { SalesFunnel } from "./sales-funnel";
import { SalesOverviewHeader } from "./sales-overview-header";
import { SalesQuickActions } from "./sales-quick-actions";
import { SalesRanking } from "./sales-ranking";
import type { FeaturedSaleData, SalesOverviewData } from "./sales-overview-types";

export function SalesOverview({ ov, featured }: { ov: SalesOverviewData; featured: FeaturedSaleData }) {

  return (
    <div className="mx-auto max-w-[1460px]">
      {/* ── Cabeçalho + banner ── */}
      <SalesOverviewHeader ov={ov} />

      {/* ── Funil + Custo da venda ── */}
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.62fr_1fr]">
        <div className="space-y-5">
          {/* Funil */}
          <SalesFunnel ov={ov} />

          {/* Orçamentos recentes */}
          <RecentQuotes ov={ov} />
        </div>

        {/* Custo Geral da Venda + Ranking */}
        <div className="space-y-5">
          {featured ? (
            <FeaturedSaleCosts featured={featured} />
          ) : <Card className="p-6"><p className="text-sm text-ink-500">Os custos aparecerão aqui após a primeira venda.</p></Card>}

          <SalesRanking ov={ov} />
        </div>
      </div>

      {/* ── Ações rápidas ── */}
      <SalesQuickActions />
    </div>
  );
}
