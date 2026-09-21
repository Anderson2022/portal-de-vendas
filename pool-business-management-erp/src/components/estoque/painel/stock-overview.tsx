import { StockStats } from "./stock-stats";
import { StockProductsTable } from "./stock-products-table";

import { PageIntro } from "@/components/ui";
import type { ProductFormProps } from "@/components/estoque/produto/product-types";

import type { StockOverviewData } from "./stock-overview-types";
import { ProductReferenceMenus } from "./product-reference-menus";
import { StockMovements } from "./stock-movements";
import { StockProcessView } from "./stock-process-view";
import { RegisteredProductsTable } from "./registered-products-table";
export function StockOverview({ s, filter, status = "", productOptions }: { s: StockOverviewData; filter: string; status?: string; productOptions: Pick<ProductFormProps, "categories" | "brands" | "warehouses" | "suppliers"> }) {
  const showAlerts = filter === "alertas";
  const visibleRows = status?s.rows.filter(row=>row.status===status):showAlerts ? s.rows.filter((r) => r.status !== "OK") : s.rows;
  const processView = filter === "transferencias" || filter === "inventarios";

  return (
    <div className="w-full max-w-none">
      <div className="relative z-40"><PageIntro
        crumbs={[{ label: "Início", href: "/inicio" }, { label: "Estoque" }]}
        title="Estoque"
        subtitle=""
        right={
          <ProductReferenceMenus s={s} productOptions={productOptions} />
        }
      /></div>

      {!filter&&<StockStats s={s} />}
      <div className="relative z-0 mt-4 w-full">
        {!filter?<RegisteredProductsTable rows={s.rows} productOptions={productOptions}/>:filter==="movimentacoes"?<StockMovements s={s}/>:processView?<StockProcessView kind={filter as "transferencias"|"inventarios"} s={s} productOptions={productOptions}/>:<StockProductsTable visibleRows={visibleRows} showAlerts={showAlerts} productOptions={productOptions}/>} 
      </div>
    </div>
  );
}
