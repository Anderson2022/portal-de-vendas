import { SaleConditions } from "@/components/commercial/sale-conditions";
import { SaleCosts } from "./sale-costs";
import { SaleDetailHeader } from "./sale-detail-header";
import { SaleItemsTable } from "./sale-items-table";
import { SaleParticipants } from "./sale-participants";
import { SalePayments } from "./sale-payments";
import { SaleProfitStats } from "./sale-profit-stats";
import type { SaleDetailData } from "./sale-detail-types";

export function SaleDetailScreen({ detail }: { detail: SaleDetailData }) {
  const { sale, items, costLines, payments, customer, seller } = detail;

  return (
    <div className="mx-auto max-w-[1460px]">
      <SaleDetailHeader sale={sale} />

      {/* Lucro em destaque */}
      <SaleProfitStats sale={sale} />

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div className="space-y-5">
          {/* Itens */}
          <SaleItemsTable items={items} />

          {/* Pagamentos */}
          <SaleConditions discount={sale.discount} notes={sale.notes} />
          <SalePayments payments={payments} />
        </div>

        <div className="space-y-5">
          {/* Custo geral */}
          <SaleCosts sale={sale} costLines={costLines} />

          {/* Cliente e vendedor */}
          <SaleParticipants customer={customer} seller={seller} sale={sale} />
        </div>
      </div>
    </div>
  );
}
